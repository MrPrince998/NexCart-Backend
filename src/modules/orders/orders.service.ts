import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  OrderPlacedEvent,
  OrderStatusChangedEvent,
  ReviewRequestEvent,
} from '@/common/events';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import {
  CouponStatus,
  DiscountType,
  InventoryMovementType,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
} from '@/common/enums';
import { CouponRedemption } from '@/modules/coupons/entities/coupon-redemption.entity';
import { Coupon } from '@/modules/coupons/entities/coupon.entity';
import { InventoryItem } from '@/modules/inventory/entities/inventory-item.entity';
import { InventoryMovement } from '@/modules/inventory/entities/inventory-movement.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { ShippingRate } from '@/modules/shipping-rates/entities/shipping-rate.entity';
import { User } from '@/modules/users/entities/user.entity';
import { paginate } from '@/common/handler/pagination.helper';
import {
  emptyReponse,
  successResponse,
} from '@/common/handler/response.helper';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';

const ORDER_SORT_COLUMNS = {
  createdAt: 'order.createdAt',
  total: 'order.total',
} as const;

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    @InjectRepository(OrderStatusHistory)
    private readonly historyRepository: Repository<OrderStatusHistory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const cartItems = await this.cartRepository.find({
      where: { userId },
      relations: { product: true },
    });

    if (!cartItems.length) throw new BadRequestException('Cart is empty');

    const unavailableItem = cartItems.find(
      (item) => item.product.status !== ProductStatus.ACTIVE,
    );
    if (unavailableItem) {
      throw new BadRequestException(
        `${unavailableItem.product.name} is no longer available`,
      );
    }

    const order = await this.dataSource.transaction(async (manager) => {
      const subtotal = cartItems.reduce((sum, item) => {
        const unitPrice = Number(
          item.product.discountPrice ?? item.product.price,
        );
        return sum + unitPrice * item.quantity;
      }, 0);

      const coupon = dto.couponCode
        ? await this.validateCoupon(manager, dto.couponCode, userId, subtotal)
        : null;
      const discountTotal = coupon
        ? this.calculateDiscount(coupon, subtotal)
        : 0;
      const shippingRate = await this.resolveShippingRate(
        manager,
        dto.shippingRateId,
        dto.shippingAddress.country,
        dto.shippingAddress.state,
        subtotal - discountTotal,
      );
      const shippingTotal = Number(shippingRate?.price ?? 0);
      const taxTotal = 0;
      const total = Math.max(
        0,
        subtotal + shippingTotal + taxTotal - discountTotal,
      );

      await this.decrementStock(manager, cartItems);

      const newOrder = manager.create(Order, {
        orderNumber: this.createOrderNumber(),
        userId,
        subtotal,
        shippingTotal,
        taxTotal,
        discountTotal,
        total,
        paymentMethod: dto.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        status: OrderStatus.PENDING,
        shippingAddress: { ...dto.shippingAddress },
        couponId: coupon?.id ?? null,
        notes: dto.notes ?? null,
      });

      const savedOrder = await manager.save(newOrder);

      const orderItems = cartItems.map((item) => {
        const unitPrice = Number(
          item.product.discountPrice ?? item.product.price,
        );
        return manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: item.productId,
          productName: item.product.name,
          sku: item.product.sku,
          quantity: item.quantity,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        });
      });

      await manager.save(OrderItem, orderItems);

      await manager.save(
        OrderStatusHistory,
        manager.create(OrderStatusHistory, {
          orderId: savedOrder.id,
          fromStatus: null,
          toStatus: OrderStatus.PENDING,
          changedByUserId: userId,
          note: 'Order created at checkout',
        }),
      );

      if (coupon) {
        coupon.usedCount += 1;
        await manager.save(Coupon, coupon);
        await manager.save(
          CouponRedemption,
          manager.create(CouponRedemption, {
            couponId: coupon.id,
            userId,
            orderId: savedOrder.id,
            discountAmount: discountTotal,
          }),
        );
      }

      await manager.delete(CartItem, { userId });

      return savedOrder;
    });

    this.eventEmitter.emit(
      'order.placed',
      new OrderPlacedEvent(
        order.id,
        order.orderNumber,
        user.id,
        user.email,
        user.name,
        cartItems.map((item) => {
          const unitPrice = Number(
            item.product.discountPrice ?? item.product.price,
          );
          return {
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice,
            lineTotal: unitPrice * item.quantity,
          };
        }),
        Number(order.subtotal),
        Number(order.shippingTotal),
        Number(order.discountTotal),
        Number(order.taxTotal),
        Number(order.total),
        order.createdAt,
      ),
    );

    return this.findOneForUser(userId, order.id);
  }

  async findMine(userId: string, query: OrderQueryDto) {
    return this.findAll({ ...query, userId });
  }

  async findAll(query: OrderQueryDto & { userId?: string }) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (query.userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId: query.userId });
    }
    if (query.status) {
      queryBuilder.andWhere('order.status = :status', { status: query.status });
    }
    if (query.paymentStatus) {
      queryBuilder.andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: query.paymentStatus,
      });
    }

    const sortColumn =
      ORDER_SORT_COLUMNS[query.sortBy ?? 'createdAt'] ??
      ORDER_SORT_COLUMNS.createdAt;
    queryBuilder.orderBy(sortColumn, query.sortOrder ?? 'DESC');

    return paginate(queryBuilder, query, 'Orders retrieved successfully');
  }

  async findOneForUser(userId: string, id: string) {
    const order = await this.findOne(id);
    if (order.data.userId !== userId)
      throw new ForbiddenException('Forbidden order');

    return successResponse(order.data, 'Order retrieved successfully');
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { items: { product: true } },
    });
    if (!order) throw new NotFoundException('Order not found');

    return successResponse(order, 'Order retrieved successfully');
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { items: true, user: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const oldStatus = order.status;
    if (dto.status && dto.status !== oldStatus) {
      this.assertValidStatusTransition(oldStatus, dto.status);
    }

    Object.assign(order, dto);
    const updated = await this.dataSource.transaction(async (manager) => {
      const savedOrder = await manager.save(Order, order);

      if (dto.status && dto.status !== oldStatus) {
        await manager.save(
          OrderStatusHistory,
          manager.create(OrderStatusHistory, {
            orderId: id,
            fromStatus: oldStatus,
            toStatus: dto.status,
            changedByUserId: null,
            note: null,
          }),
        );

        if (dto.status === OrderStatus.CANCELLED) {
          await this.restoreStock(manager, order.items, id);
        }
      }

      return savedOrder;
    });

    if (dto.status && dto.status !== oldStatus) {
      this.eventEmitter.emit(
        'order.status.changed',
        new OrderStatusChangedEvent(
          updated.id,
          updated.orderNumber,
          order.user.email,
          order.user.name,
          updated.status,
          oldStatus,
        ),
      );

      if (updated.status === OrderStatus.DELIVERED) {
        this.eventEmitter.emit(
          'order.review.requested',
          new ReviewRequestEvent(
            updated.id,
            updated.orderNumber,
            order.user.email,
            order.user.name,
            `${process.env.FRONTEND_URL}/orders/${updated.id}/review`,
          ),
        );
      }
    }

    return successResponse(updated, 'Order updated successfully');
  }

  async statusHistory(id: string) {
    return successResponse(
      await this.historyRepository.find({
        where: { orderId: id },
        relations: { changedBy: true },
        order: { createdAt: 'DESC' },
      }),
      'Order status history retrieved successfully',
    );
  }

  async cancelMine(userId: string, id: string) {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
      throw new BadRequestException('Order can no longer be cancelled');
    }

    await this.dataSource.transaction(async (manager) => {
      const oldStatus = order.status;
      order.status = OrderStatus.CANCELLED;
      await manager.save(Order, order);
      await manager.save(
        OrderStatusHistory,
        manager.create(OrderStatusHistory, {
          orderId: id,
          fromStatus: oldStatus,
          toStatus: OrderStatus.CANCELLED,
          changedByUserId: userId,
          note: 'Cancelled by customer',
        }),
      );
      await this.restoreStock(manager, order.items, id);
    });

    return emptyReponse('Order cancelled successfully');
  }

  private async validateCoupon(
    manager: any,
    code: string,
    userId: string,
    subtotal: number,
  ): Promise<Coupon> {
    const coupon = await manager.findOne(Coupon, {
      where: { code: code.toUpperCase() },
      lock: { mode: 'pessimistic_write' },
    });

    if (!coupon) throw new BadRequestException('Coupon not found');
    if (coupon.status !== CouponStatus.ACTIVE) {
      throw new BadRequestException('Coupon is not active');
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new BadRequestException('Coupon is not active yet');
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      throw new BadRequestException('Coupon has expired');
    }
    if (
      coupon.minimumOrderAmount &&
      subtotal < Number(coupon.minimumOrderAmount)
    ) {
      throw new BadRequestException(
        'Order does not meet coupon minimum amount',
      );
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }
    if (coupon.usageLimitPerUser) {
      const userUsageCount = await manager.count(CouponRedemption, {
        where: { couponId: coupon.id, userId },
      });
      if (userUsageCount >= coupon.usageLimitPerUser) {
        throw new BadRequestException(
          'Coupon usage limit reached for this user',
        );
      }
    }

    return coupon;
  }

  private calculateDiscount(coupon: Coupon, subtotal: number): number {
    const rawDiscount =
      coupon.discountType === DiscountType.PERCENTAGE
        ? subtotal * (Number(coupon.discountValue) / 100)
        : Number(coupon.discountValue);

    const cappedDiscount = coupon.maximumDiscountAmount
      ? Math.min(rawDiscount, Number(coupon.maximumDiscountAmount))
      : rawDiscount;

    return Math.min(subtotal, Number(cappedDiscount.toFixed(2)));
  }

  private async resolveShippingRate(
    manager: any,
    shippingRateId: string | undefined,
    country: string,
    state: string,
    orderAmount: number,
  ): Promise<ShippingRate | null> {
    const queryBuilder = manager
      .createQueryBuilder(ShippingRate, 'rate')
      .leftJoinAndSelect('rate.zone', 'zone')
      .where('rate.isActive = true')
      .andWhere('zone.isActive = true');

    if (shippingRateId) {
      queryBuilder.andWhere('rate.id = :shippingRateId', { shippingRateId });
    }

    const rates = await queryBuilder.orderBy('rate.price', 'ASC').getMany();
    const matchedRate = rates.find((rate) => {
      const countries = rate.zone.countries.map((item) => item.toUpperCase());
      const states = rate.zone.states?.map((item) => item.toUpperCase()) ?? [];
      const countryMatches = countries.includes(country.toUpperCase());
      const stateMatches =
        !states.length || states.includes(state.toUpperCase());
      const minMatches =
        !rate.minOrderAmount || orderAmount >= Number(rate.minOrderAmount);
      const maxMatches =
        !rate.maxOrderAmount || orderAmount <= Number(rate.maxOrderAmount);
      return countryMatches && stateMatches && minMatches && maxMatches;
    });

    if (shippingRateId && !matchedRate) {
      throw new BadRequestException('Shipping rate is not applicable');
    }

    return matchedRate ?? null;
  }

  private async decrementStock(manager: any, cartItems: CartItem[]) {
    for (const item of cartItems) {
      const inventoryQuery = manager
        .createQueryBuilder(InventoryItem, 'inventory')
        .where('inventory.productId = :productId', {
          productId: item.productId,
        });

      if (item.variantId) {
        inventoryQuery.andWhere('inventory.variantId = :variantId', {
          variantId: item.variantId,
        });
      } else {
        inventoryQuery.andWhere('inventory.variantId IS NULL');
      }

      const inventory = await inventoryQuery
        .setLock('pessimistic_write')
        .getOne();

      if (inventory) {
        const available = inventory.quantity - inventory.reservedQuantity;
        if (available < item.quantity) {
          throw new BadRequestException(`${item.product.name} is out of stock`);
        }
        inventory.quantity -= item.quantity;
        await manager.save(InventoryItem, inventory);
        await manager.save(
          InventoryMovement,
          manager.create(InventoryMovement, {
            inventoryItemId: inventory.id,
            type: InventoryMovementType.STOCK_OUT,
            quantity: -item.quantity,
            referenceType: 'checkout',
            referenceId: null,
            note: 'Stock deducted during checkout',
          }),
        );
        continue;
      }

      const product = await manager
        .createQueryBuilder(Product, 'product')
        .where('product.id = :productId', { productId: item.productId })
        .setLock('pessimistic_write')
        .getOne();

      if (!product || product.stock < item.quantity) {
        throw new BadRequestException(`${item.product.name} is out of stock`);
      }
      product.stock -= item.quantity;
      await manager.save(Product, product);
    }
  }

  private async restoreStock(
    manager: any,
    orderItems: OrderItem[],
    orderId: string,
  ) {
    for (const item of orderItems) {
      const inventoryQuery = manager
        .createQueryBuilder(InventoryItem, 'inventory')
        .where('inventory.productId = :productId', {
          productId: item.productId,
        });

      if (item.variantId) {
        inventoryQuery.andWhere('inventory.variantId = :variantId', {
          variantId: item.variantId,
        });
      } else {
        inventoryQuery.andWhere('inventory.variantId IS NULL');
      }

      const inventory = await inventoryQuery
        .setLock('pessimistic_write')
        .getOne();

      if (inventory) {
        inventory.quantity += item.quantity;
        await manager.save(InventoryItem, inventory);
        await manager.save(
          InventoryMovement,
          manager.create(InventoryMovement, {
            inventoryItemId: inventory.id,
            type: InventoryMovementType.STOCK_IN,
            quantity: item.quantity,
            referenceType: 'order',
            referenceId: orderId,
            note: 'Stock restored after order cancellation',
          }),
        );
        continue;
      }

      await manager.increment(
        Product,
        { id: item.productId },
        'stock',
        item.quantity,
      );
    }
  }

  private assertValidStatusTransition(from: OrderStatus, to: OrderStatus) {
    if (!ORDER_STATUS_TRANSITIONS[from].includes(to)) {
      throw new BadRequestException(`Cannot move order from ${from} to ${to}`);
    }
  }

  private createOrderNumber() {
    return `NC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
}
