import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '@/modules/addresses/entities/address.entity';
import { ActivityLog } from '@/modules/activity/entities/activity-log.entity';
import { ProductView } from '@/modules/activity/entities/product-view.entity';
import { AuditLog } from '@/modules/audit/entities/audit-log.entity';
import { AuthAccount } from '@/modules/auth/entities/auth-account.entity';
import { AuthSession } from '@/modules/auth/entities/auth-session.entity';
import { AuthVerification } from '@/modules/auth/entities/auth-verification.entity';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { Coupon } from '@/modules/coupons/entities/coupon.entity';
import { CouponRedemption } from '@/modules/coupons/entities/coupon-redemption.entity';
import { Brand } from '@/modules/brands/entities/brand.entity';
import { InventoryItem } from '@/modules/inventory/entities/inventory-item.entity';
import { InventoryMovement } from '@/modules/inventory/entities/inventory-movement.entity';
import { Notification } from '@/modules/notifications/entities/notification.entity';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { OrderStatusHistory } from '@/modules/orders/entities/order-status-history.entity';
import { Order } from '@/modules/orders/entities/order.entity';
import { Payment } from '@/modules/payments/entities/payment.entity';
import { PaymentWebhookEvent } from '@/modules/payments/entities/payment-webhook-event.entity';
import { ProductCategory } from '@/modules/product-category/entities/product-category.entity';
import { ProductAttribute } from '@/modules/product-attributes/entities/product-attribute.entity';
import { ProductAttributeValue } from '@/modules/product-attributes/entities/product-attribute-value.entity';
import { ProductImage } from '@/modules/product-variants/entities/product-image.entity';
import { ProductVariant } from '@/modules/product-variants/entities/product-variant.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { Refund } from '@/modules/returns/entities/refund.entity';
import { RecommendationScore } from '@/modules/recommendations/entities/recommendation-score.entity';
import { ReturnRequest } from '@/modules/returns/entities/return-request.entity';
import { Review } from '@/modules/reviews/entities/review.entity';
import { Role } from '@/modules/roles/entities/role.entity';
import { Shipment } from '@/modules/shipping/entities/shipment.entity';
import { ShippingRate } from '@/modules/shipping-rates/entities/shipping-rate.entity';
import { ShippingZone } from '@/modules/shipping-rates/entities/shipping-zone.entity';
import { Store } from '@/modules/stores/entities/store.entity';
import { ProductTag } from '@/modules/tags/entities/product-tag.entity';
import { Tag } from '@/modules/tags/entities/tag.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Wishlist } from '@/modules/wishlist/entities/wishlist.entity';
import { WishlistItem } from '@/modules/wishlist/entities/wishlist-item.entity';

const entities = [
  Address,
  ActivityLog,
  AuditLog,
  AuthAccount,
  AuthSession,
  AuthVerification,
  Cart,
  CartItem,
  Brand,
  Coupon,
  CouponRedemption,
  InventoryItem,
  InventoryMovement,
  Notification,
  Order,
  OrderItem,
  OrderStatusHistory,
  Payment,
  PaymentWebhookEvent,
  Product,
  ProductView,
  ProductAttribute,
  ProductAttributeValue,
  ProductCategory,
  ProductImage,
  ProductTag,
  ProductVariant,
  Refund,
  RecommendationScore,
  ReturnRequest,
  Review,
  Role,
  Shipment,
  ShippingRate,
  ShippingZone,
  Store,
  Tag,
  User,
  Wishlist,
  WishlistItem,
];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  exports: [TypeOrmModule],
})
export class DatabaseSchemaModule {}
