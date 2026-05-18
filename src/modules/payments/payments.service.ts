import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import Stripe from 'stripe';
import {
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
} from '@/common/enums';
import { successResponse } from '@/common/handler/response.helper';
import { OrderStatusHistory } from '@/modules/orders/entities/order-status-history.entity';
import { Order } from '@/modules/orders/entities/order.entity';
import { Payment } from './entities/payment.entity';
import { PaymentWebhookEvent } from './entities/payment-webhook-event.entity';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/payment.dto';
import { CreateStripeCheckoutSessionDto } from './dto/stripe-checkout-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: any;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentWebhookEvent)
    private readonly webhookRepository: Repository<PaymentWebhookEvent>,
    private readonly dataSource: DataSource,
  ) {
    const secretKey = process.env.STRIPE_SECRET_KEY ?? process.env.PAYMENT_API_KEY;
    this.stripe = secretKey
      ? new Stripe(secretKey, { apiVersion: '2026-04-22.dahlia' })
      : null;
  }

  async findAll() {
    return successResponse(
      await this.paymentRepository.find({ relations: { order: true }, order: { createdAt: 'DESC' } }),
      'Payments retrieved successfully',
    );
  }

  async create(dto: CreatePaymentDto) {
    const payment = this.paymentRepository.create({
      ...dto,
      currency: dto.currency ?? 'USD',
      providerTransactionId: dto.providerTransactionId ?? null,
      checkoutSessionId: null,
      metadata: dto.metadata ?? null,
    });
    return successResponse(await this.paymentRepository.save(payment), 'Payment created successfully', 201);
  }

  async updateStatus(id: string, dto: UpdatePaymentStatusDto) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: { order: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const updated = await this.dataSource.transaction(async (manager) => {
      payment.status = dto.status;
      payment.paidAt =
        dto.status === PaymentStatus.PAID ? new Date() : payment.paidAt;
      const savedPayment = await manager.save(Payment, payment);

      const order = await manager.findOne(Order, {
        where: { id: payment.orderId },
      });
      if (!order) return savedPayment;

      const previousStatus = order.status;
      order.paymentStatus = dto.status;

      if (
        dto.status === PaymentStatus.PAID &&
        order.status === OrderStatus.PENDING
      ) {
        order.status = OrderStatus.CONFIRMED;
      }

      if (dto.status === PaymentStatus.REFUNDED) {
        order.paymentStatus = PaymentStatus.REFUNDED;
      }

      await manager.save(Order, order);

      if (order.status !== previousStatus) {
        await manager.save(
          OrderStatusHistory,
          manager.create(OrderStatusHistory, {
            orderId: order.id,
            fromStatus: previousStatus,
            toStatus: order.status,
            changedByUserId: null,
            note: `Payment marked as ${dto.status}`,
          }),
        );
      }

      return savedPayment;
    });

    return successResponse(updated, 'Payment updated successfully');
  }

  async createStripeCheckoutSession(
    userId: string,
    dto: CreateStripeCheckoutSessionDto,
  ) {
    if (!this.stripe) {
      throw new InternalServerErrorException('Stripe is not configured');
    }

    const order = await this.dataSource.getRepository(Order).findOne({
      where: { id: dto.orderId },
      relations: { items: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Forbidden order');
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Order is already paid');
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cancelled orders cannot be paid');
    }

    const currency = (dto.currency ?? 'USD').toLowerCase();
    const successUrl =
      dto.successUrl ??
      process.env.STRIPE_SUCCESS_URL ??
      `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl =
      dto.cancelUrl ??
      process.env.STRIPE_CANCEL_URL ??
      `${process.env.FRONTEND_URL}/checkout/cancel`;

    const session = await this.stripe.checkout.sessions.create(
      {
        mode: 'payment',
        client_reference_id: order.id,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          orderId: order.id,
          userId,
        },
        payment_intent_data: {
          metadata: {
            orderId: order.id,
            userId,
          },
        },
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency,
              unit_amount: this.toStripeAmount(Number(order.total)),
              product_data: {
                name: `NexCart Order ${order.orderNumber}`,
              },
            },
          },
        ],
      },
      {
        idempotencyKey: `checkout-session:${order.id}:${Number(order.total)}`,
      },
    );

    const payment = await this.paymentRepository.save(
      this.paymentRepository.create({
        orderId: order.id,
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.PENDING,
        amount: Number(order.total),
        currency: currency.toUpperCase(),
        providerTransactionId:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : null,
        checkoutSessionId: session.id,
        metadata: {
          sessionUrl: session.url,
        },
      }),
    );

    return successResponse(
      {
        payment,
        checkoutSessionId: session.id,
        url: session.url,
      },
      'Stripe checkout session created successfully',
      201,
    );
  }

  async handleStripeWebhook(signature: string | undefined, rawBody?: Buffer) {
    if (!this.stripe) {
      throw new InternalServerErrorException('Stripe is not configured');
    }
    if (!signature) throw new BadRequestException('Missing Stripe signature');
    if (!rawBody) throw new BadRequestException('Missing raw request body');

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new InternalServerErrorException(
        'Stripe webhook secret is not configured',
      );
    }

    let event: any;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    const existingEvent = await this.webhookRepository.findOne({
      where: { provider: 'stripe', eventId: event.id },
    });

    if (existingEvent?.processedAt) {
      return successResponse({ received: true }, 'Webhook already processed');
    }

    const webhookEvent =
      existingEvent ??
      this.webhookRepository.create({
        provider: 'stripe',
        eventId: event.id,
        eventType: event.type,
        payload: event as Record<string, unknown>,
        processedAt: null,
        error: null,
      });

    try {
      await this.processStripeEvent(event);
      webhookEvent.processedAt = new Date();
      webhookEvent.error = null;
    } catch (error) {
      webhookEvent.error =
        error instanceof Error ? error.message : 'Unknown webhook error';
      await this.webhookRepository.save(webhookEvent);
      throw error;
    }

    await this.webhookRepository.save(webhookEvent);
    return successResponse({ received: true }, 'Stripe webhook processed');
  }

  private async processStripeEvent(event: any) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId ?? session.client_reference_id;
        if (!orderId) return;
        await this.markOrderPaymentFromStripe(
          orderId,
          PaymentStatus.PAID,
          session.id,
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : null,
        );
        return;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) return;
        await this.markOrderPaymentFromStripe(
          orderId,
          PaymentStatus.FAILED,
          null,
          paymentIntent.id,
        );
        return;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        const paymentIntentId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : null;
        if (!paymentIntentId) return;
        const payment = await this.paymentRepository.findOne({
          where: { providerTransactionId: paymentIntentId },
        });
        if (!payment) return;
        await this.markOrderPaymentFromStripe(
          payment.orderId,
          PaymentStatus.REFUNDED,
          payment.checkoutSessionId,
          paymentIntentId,
        );
        return;
      }
      default:
        return;
    }
  }

  private async markOrderPaymentFromStripe(
    orderId: string,
    status: PaymentStatus,
    checkoutSessionId: string | null,
    paymentIntentId: string | null,
  ) {
    await this.dataSource.transaction(async (manager) => {
      let payment = await manager.findOne(Payment, {
        where: checkoutSessionId
          ? { checkoutSessionId }
          : { providerTransactionId: paymentIntentId ?? '' },
      });

      const order = await manager.findOne(Order, { where: { id: orderId } });
      if (!order) return;

      if (!payment) {
        payment = manager.create(Payment, {
          orderId,
          provider: PaymentProvider.STRIPE,
          status,
          amount: Number(order.total),
          currency: 'USD',
          checkoutSessionId,
          providerTransactionId: paymentIntentId,
          metadata: null,
        });
      }

      payment.status = status;
      payment.checkoutSessionId = checkoutSessionId ?? payment.checkoutSessionId;
      payment.providerTransactionId =
        paymentIntentId ?? payment.providerTransactionId;
      payment.paidAt = status === PaymentStatus.PAID ? new Date() : payment.paidAt;
      await manager.save(Payment, payment);

      const oldStatus = order.status;
      order.paymentStatus = status;

      if (status === PaymentStatus.PAID && order.status === OrderStatus.PENDING) {
        order.status = OrderStatus.CONFIRMED;
      }

      await manager.save(Order, order);

      if (oldStatus !== order.status) {
        await manager.save(
          OrderStatusHistory,
          manager.create(OrderStatusHistory, {
            orderId: order.id,
            fromStatus: oldStatus,
            toStatus: order.status,
            changedByUserId: null,
            note: `Stripe payment marked as ${status}`,
          }),
        );
      }
    });
  }

  private toStripeAmount(amount: number) {
    return Math.round(amount * 100);
  }
}
