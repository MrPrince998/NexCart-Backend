export interface OrderReceiptItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export class OrderPlacedEvent {
  constructor(
    public id: string,
    public orderNumber: string,
    public userId: string,
    public userEmail: string,
    public userName: string,
    public items: OrderReceiptItem[],
    public subtotal: number,
    public shippingTotal: number,
    public discountTotal: number,
    public taxTotal: number,
    public total: number,
    public createdAt: Date = new Date(),
  ) {}
}

export class OrderStatusChangedEvent {
  constructor(
    public id: string,
    public orderNumber: string,
    public userEmail: string,
    public userName: string,
    public status: string,
    public previousStatus: string,
    public timestamp: Date = new Date(),
  ) {}
}

export class PaymentStatusChangedEvent {
  constructor(
    public orderId: string,
    public orderNumber: string,
    public userEmail: string,
    public userName: string,
    public status: string,
    public amount: number,
    public currency: string,
    public timestamp: Date = new Date(),
  ) {}
}

export class ReturnStatusChangedEvent {
  constructor(
    public id: string,
    public orderNumber: string,
    public userEmail: string,
    public userName: string,
    public status: string,
    public reason: string,
    public timestamp: Date = new Date(),
  ) {}
}

export class RefundStatusChangedEvent {
  constructor(
    public id: string,
    public orderNumber: string,
    public userEmail: string,
    public userName: string,
    public status: string,
    public amount: number,
    public currency: string,
    public timestamp: Date = new Date(),
  ) {}
}

export class ReviewRequestEvent {
  constructor(
    public orderId: string,
    public orderNumber: string,
    public userEmail: string,
    public userName: string,
    public reviewUrl: string,
    public timestamp: Date = new Date(),
  ) {}
}

export class CouponPromoEvent {
  constructor(
    public couponCode: string,
    public couponName: string,
    public description: string | null,
    public userEmail: string,
    public userName: string,
    public timestamp: Date = new Date(),
  ) {}
}
