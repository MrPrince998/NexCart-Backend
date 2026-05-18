export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum CouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export enum InventoryMovementType {
  STOCK_IN = 'stock_in',
  STOCK_OUT = 'stock_out',
  ADJUSTMENT = 'adjustment',
  RESERVATION = 'reservation',
  RELEASE = 'release',
}

export enum PaymentProvider {
  CASH = 'cash',
  STRIPE = 'stripe',
  KHALTI = 'khalti',
  ESEWA = 'esewa',
  PAYPAL = 'paypal',
}

export enum ShipmentStatus {
  PENDING = 'pending',
  READY_TO_SHIP = 'ready_to_ship',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned',
}

export enum NotificationType {
  ORDER = 'order',
  PAYMENT = 'payment',
  PROMOTION = 'promotion',
  SYSTEM = 'system',
}

export enum ReturnStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RECEIVED = 'received',
  REFUNDED = 'refunded',
}

export enum RefundStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  STATUS_CHANGE = 'status_change',
  ROLE_CHANGE = 'role_change',
}

export enum ProductAttributeType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  COLOR = 'color',
}

export enum ActivityType {
  PRODUCT_VIEW = 'product_view',
  SEARCH = 'search',
  ADD_TO_CART = 'add_to_cart',
  ADD_TO_WISHLIST = 'add_to_wishlist',
  CHECKOUT = 'checkout',
  PURCHASE = 'purchase',
}

export enum RecommendationReason {
  POPULAR = 'popular',
  SIMILAR_CATEGORY = 'similar_category',
  RECENTLY_VIEWED = 'recently_viewed',
  PURCHASE_HISTORY = 'purchase_history',
  TRENDING = 'trending',
  MANUAL = 'manual',
}

export enum StoreStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}
