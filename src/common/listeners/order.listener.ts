import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  OrderPlacedEvent,
  OrderStatusChangedEvent,
  PaymentStatusChangedEvent,
  CouponPromoEvent,
  ProductSellerStatusChangedEvent,
  SellerLowStockEvent,
  RefundStatusChangedEvent,
  ReturnStatusChangedEvent,
  ReviewRequestEvent,
  StoreStatusChangedEvent,
  UserSecurityEmailEvent,
  WishlistPriceDropEvent,
  BackInStockEvent,
} from '../events';
import { EMAIL_QUEUE } from '@/jobs/queues';

@Injectable()
export class OrderEventListener {
  private readonly logger = new Logger(OrderEventListener.name);

  constructor(@InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue) {}

  @OnEvent('order.placed')
  async handleOrderPlaced(event: OrderPlacedEvent) {
    this.logger.log(
      `Order placed: ${event.orderNumber} (${event.id}) for ${event.userEmail}`,
    );

    try {
      await this.emailQueue.add('send-email', {
        to: event.userEmail,
        subject: `Receipt for order ${event.orderNumber}`,
        template: 'order-receipt',
        data: {
          userName: event.userName,
          orderNumber: event.orderNumber,
          orderUrl: `${process.env.FRONTEND_URL}/orders/${event.id}`,
          items: event.items,
          subtotal: event.subtotal,
          shippingTotal: event.shippingTotal,
          discountTotal: event.discountTotal,
          taxTotal: event.taxTotal,
          total: event.total,
        },
      });

      this.logger.log(`Order placed: receipt email queued`);
    } catch (error) {
      this.logger.error(`Error handling order placed event:`, error);
    }
  }

  @OnEvent('order.status.changed')
  async handleOrderStatusChanged(event: OrderStatusChangedEvent) {
    await this.queueStatusEmail({
      to: event.userEmail,
      userName: event.userName,
      subject: `Order ${event.orderNumber} is ${event.status}`,
      title: `Order ${event.status}`,
      message: `Your order ${event.orderNumber} changed from ${event.previousStatus} to ${event.status}.`,
      actionUrl: `${process.env.FRONTEND_URL}/orders/${event.id}`,
      actionText: 'View Order',
    });
  }

  @OnEvent('order.review.requested')
  async handleReviewRequest(event: ReviewRequestEvent) {
    await this.emailQueue.add('send-email', {
      to: event.userEmail,
      subject: `Review your order ${event.orderNumber}`,
      template: 'review-request',
      data: {
        userName: event.userName,
        orderNumber: event.orderNumber,
        reviewUrl: event.reviewUrl,
      },
    });
  }

  @OnEvent('payment.status.changed')
  async handlePaymentStatusChanged(event: PaymentStatusChangedEvent) {
    const subject =
      event.status === 'failed'
        ? `Payment failed for order ${event.orderNumber}`
        : `Payment ${event.status} for order ${event.orderNumber}`;

    await this.queueStatusEmail({
      to: event.userEmail,
      userName: event.userName,
      subject,
      title: subject,
      message: `Payment for order ${event.orderNumber} is ${event.status}. Amount: ${event.currency} ${event.amount.toFixed(2)}.`,
      actionUrl: `${process.env.FRONTEND_URL}/orders/${event.orderId}`,
      actionText: 'View Order',
    });
  }

  @OnEvent('return.status.changed')
  async handleReturnStatusChanged(event: ReturnStatusChangedEvent) {
    await this.queueStatusEmail({
      to: event.userEmail,
      userName: event.userName,
      subject: `Return request ${event.status}`,
      title: `Return request ${event.status}`,
      message: `Your return request for order ${event.orderNumber} is now ${event.status}. Reason: ${event.reason}.`,
      actionUrl: `${process.env.FRONTEND_URL}/returns`,
      actionText: 'View Returns',
    });
  }

  @OnEvent('refund.status.changed')
  async handleRefundStatusChanged(event: RefundStatusChangedEvent) {
    await this.queueStatusEmail({
      to: event.userEmail,
      userName: event.userName,
      subject: `Refund ${event.status} for order ${event.orderNumber}`,
      title: `Refund ${event.status}`,
      message: `Your refund for order ${event.orderNumber} is ${event.status}. Amount: ${event.currency} ${event.amount.toFixed(2)}.`,
      actionUrl: `${process.env.FRONTEND_URL}/returns`,
      actionText: 'View Returns',
    });
  }

  @OnEvent('store.status.changed')
  async handleStoreStatusChanged(event: StoreStatusChangedEvent) {
    await this.queueStatusEmail({
      to: event.ownerEmail,
      userName: event.ownerName,
      subject: `Store ${event.name} is ${event.status}`,
      title: `Store ${event.status}`,
      message: `Your store "${event.name}" is now ${event.status}.`,
      actionUrl: `${process.env.FRONTEND_URL}/seller`,
      actionText: 'Open Seller Dashboard',
    });
  }

  @OnEvent('product.seller.status.changed')
  async handleProductSellerStatusChanged(
    event: ProductSellerStatusChangedEvent,
  ) {
    await this.queueStatusEmail({
      to: event.sellerEmail,
      userName: event.sellerName,
      subject: `Product ${event.name} is ${event.status}`,
      title: `Product ${event.status}`,
      message: `Your product "${event.name}" is now ${event.status}.`,
      actionUrl: `${process.env.FRONTEND_URL}/seller/products/${event.id}`,
      actionText: 'View Product',
    });
  }

  @OnEvent('seller.low_stock')
  async handleSellerLowStock(event: SellerLowStockEvent) {
    await this.queueStatusEmail({
      to: event.sellerEmail,
      userName: event.sellerName,
      subject: `Low stock: ${event.productName}`,
      title: 'Low stock alert',
      message: `${event.productName} has ${event.availableQuantity} item(s) available, at or below your threshold of ${event.threshold}.`,
      actionUrl: `${process.env.FRONTEND_URL}/seller/products/${event.productId}`,
      actionText: 'Update Inventory',
    });
  }

  @OnEvent('wishlist.price_drop')
  async handleWishlistPriceDrop(event: WishlistPriceDropEvent) {
    await this.queueStatusEmail({
      to: event.userEmail,
      userName: event.userName,
      subject: `Price drop: ${event.productName}`,
      title: 'Wishlist price drop',
      message: `${event.productName} dropped from ${event.oldPrice.toFixed(2)} to ${event.newPrice.toFixed(2)}.`,
      actionUrl: `${process.env.FRONTEND_URL}/products/${event.productId}`,
      actionText: 'View Product',
    });
  }

  @OnEvent('wishlist.back_in_stock')
  async handleBackInStock(event: BackInStockEvent) {
    await this.queueStatusEmail({
      to: event.userEmail,
      userName: event.userName,
      subject: `Back in stock: ${event.productName}`,
      title: 'Back in stock',
      message: `${event.productName} is available again.`,
      actionUrl: `${process.env.FRONTEND_URL}/products/${event.productId}`,
      actionText: 'View Product',
    });
  }

  @OnEvent('coupon.promo')
  async handleCouponPromo(event: CouponPromoEvent) {
    await this.queueStatusEmail({
      to: event.userEmail,
      userName: event.userName,
      subject: `Promo: ${event.couponName}`,
      title: event.couponName,
      message:
        `Use coupon ${event.couponCode}. ${event.description ?? ''}`.trim(),
      actionUrl: `${process.env.FRONTEND_URL}/products`,
      actionText: 'Shop Now',
    });
  }

  @OnEvent('user.security.email')
  async handleUserSecurityEmail(event: UserSecurityEmailEvent) {
    await this.queueStatusEmail({
      to: event.email,
      userName: event.name,
      subject: event.subject,
      title: event.title,
      message: event.message,
      actionUrl: `${process.env.FRONTEND_URL}/account/security`,
      actionText: 'Review Security',
    });
  }

  private async queueStatusEmail(input: {
    to: string;
    userName: string;
    subject: string;
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
  }) {
    await this.emailQueue.add('send-email', {
      to: input.to,
      subject: input.subject,
      template: 'status-update',
      data: {
        userName: input.userName,
        title: input.title,
        message: input.message,
        actionUrl: input.actionUrl,
        actionText: input.actionText,
      },
    });
  }
}
