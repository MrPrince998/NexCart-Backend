import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { Coupon } from '@/modules/coupons/entities/coupon.entity';
import { CouponRedemption } from '@/modules/coupons/entities/coupon-redemption.entity';
import { InventoryItem } from '@/modules/inventory/entities/inventory-item.entity';
import { InventoryMovement } from '@/modules/inventory/entities/inventory-movement.entity';
import { Payment } from '@/modules/payments/entities/payment.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { ShippingRate } from '@/modules/shipping-rates/entities/shipping-rate.entity';
import { Shipment } from '@/modules/shipping/entities/shipment.entity';
import { User } from '@/modules/users/entities/user.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderStatusHistory,
      CartItem,
      Coupon,
      CouponRedemption,
      InventoryItem,
      InventoryMovement,
      Payment,
      Product,
      ShippingRate,
      Shipment,
      User,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
