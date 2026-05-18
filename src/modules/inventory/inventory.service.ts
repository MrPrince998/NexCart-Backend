import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { InventoryMovementType } from '@/common/enums';
import { BackInStockEvent, SellerLowStockEvent } from '@/common/events';
import { successResponse } from '@/common/handler/response.helper';
import { User } from '@/modules/users/entities/user.entity';
import { WishlistItem } from '@/modules/wishlist/entities/wishlist-item.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { InventoryMovement } from './entities/inventory-movement.entity';
import {
  CreateInventoryMovementDto,
  UpdateInventoryDto,
} from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(InventoryMovement)
    private readonly movementRepository: Repository<InventoryMovement>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll() {
    return successResponse(
      await this.inventoryRepository.find({
        relations: { product: true, variant: true },
        order: { updatedAt: 'DESC' },
      }),
      'Inventory retrieved successfully',
    );
  }

  async update(id: string, dto: UpdateInventoryDto) {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    const oldAvailable = this.getAvailableQuantity(item);
    item.quantity = dto.quantity;
    item.lowStockThreshold = dto.lowStockThreshold ?? item.lowStockThreshold;
    const savedItem = await this.inventoryRepository.save(item);
    await this.emitInventoryEmailEvents(savedItem.id, oldAvailable);

    return successResponse(savedItem, 'Inventory updated successfully');
  }

  async addMovement(id: string, dto: CreateInventoryMovementDto) {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');

    const result = await this.dataSource.transaction(async (manager) => {
      const oldAvailable = this.getAvailableQuantity(item);
      this.applyMovement(item, dto.type, dto.quantity);
      const savedItem = await manager.save(InventoryItem, item);
      const movement = await manager.save(
        InventoryMovement,
        manager.create(InventoryMovement, {
          inventoryItemId: id,
          type: dto.type,
          quantity: this.toSignedMovementQuantity(dto.type, dto.quantity),
          referenceType: dto.referenceType ?? null,
          referenceId: dto.referenceId ?? null,
          note: dto.note ?? null,
        }),
      );
      return { item: savedItem, movement, oldAvailable };
    });

    await this.emitInventoryEmailEvents(result.item.id, result.oldAvailable);

    return successResponse(result, 'Inventory movement recorded successfully');
  }

  private async emitInventoryEmailEvents(id: string, oldAvailable: number) {
    const item = await this.inventoryRepository.findOne({
      where: { id },
      relations: { product: { store: { owner: true } } },
    });
    if (!item) return;

    const available = this.getAvailableQuantity(item);

    if (
      item.lowStockThreshold > 0 &&
      available <= item.lowStockThreshold &&
      item.product.store?.owner?.emailNotificationsEnabled &&
      item.product.store.owner.sellerEmailNotificationsEnabled
    ) {
      this.eventEmitter.emit(
        'seller.low_stock',
        new SellerLowStockEvent(
          item.productId,
          item.product.name,
          available,
          item.lowStockThreshold,
          item.product.store.owner.email,
          item.product.store.owner.name,
        ),
      );
    }

    if (oldAvailable <= 0 && available > 0) {
      await this.emitBackInStock(item.productId, item.product.name);
    }
  }

  private async emitBackInStock(productId: string, productName: string) {
    const wishlistItems = await this.dataSource
      .getRepository(WishlistItem)
      .find({ where: { productId } });
    const userIds = [...new Set(wishlistItems.map((item) => item.userId))];
    if (!userIds.length) return;

    const users = await this.dataSource.getRepository(User).find({
      where: { id: In(userIds) },
    });

    for (const user of users) {
      if (
        !user.emailNotificationsEnabled ||
        !user.wishlistEmailNotificationsEnabled
      ) {
        continue;
      }

      this.eventEmitter.emit(
        'wishlist.back_in_stock',
        new BackInStockEvent(productId, productName, user.email, user.name),
      );
    }
  }

  private getAvailableQuantity(
    item: Pick<InventoryItem, 'quantity' | 'reservedQuantity'>,
  ) {
    return item.quantity - item.reservedQuantity;
  }

  async movements(id: string) {
    return successResponse(
      await this.movementRepository.find({
        where: { inventoryItemId: id },
        order: { createdAt: 'DESC' },
      }),
      'Inventory movements retrieved successfully',
    );
  }

  private applyMovement(
    item: InventoryItem,
    type: InventoryMovementType,
    quantity: number,
  ) {
    switch (type) {
      case InventoryMovementType.STOCK_IN:
        item.quantity += quantity;
        return;
      case InventoryMovementType.STOCK_OUT:
        if (item.quantity - item.reservedQuantity < quantity) {
          throw new BadRequestException('Insufficient available inventory');
        }
        item.quantity -= quantity;
        return;
      case InventoryMovementType.ADJUSTMENT:
        if (quantity < item.reservedQuantity) {
          throw new BadRequestException(
            'Adjusted quantity cannot be lower than reserved quantity',
          );
        }
        item.quantity = quantity;
        return;
      case InventoryMovementType.RESERVATION:
        if (item.quantity - item.reservedQuantity < quantity) {
          throw new BadRequestException('Insufficient available inventory');
        }
        item.reservedQuantity += quantity;
        return;
      case InventoryMovementType.RELEASE:
        item.reservedQuantity = Math.max(0, item.reservedQuantity - quantity);
        return;
      default:
        throw new BadRequestException('Unsupported inventory movement');
    }
  }

  private toSignedMovementQuantity(
    type: InventoryMovementType,
    quantity: number,
  ) {
    return [
      InventoryMovementType.STOCK_OUT,
      InventoryMovementType.RELEASE,
    ].includes(type)
      ? -quantity
      : quantity;
  }
}
