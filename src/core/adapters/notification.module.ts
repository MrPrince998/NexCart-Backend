import { Module } from '@nestjs/common';
import { NotificationGateway } from './socket.adapter';
import { NotificationEmitterService } from './notification-emitter.service';

/**
 * Notification Module
 * Exports:
 * - NotificationGateway: WebSocket gateway for real-time notifications
 * - NotificationEmitterService: Service to send notifications to connected clients
 *
 * Usage in event listeners:
 * ```typescript
 * constructor(
 *   private readonly notificationEmitter: NotificationEmitterService
 * ) {}
 *
 * @OnEvent('product.created')
 * async handleProductCreated(event: ProductCreatedEvent) {
 *   // Save to DB...
 *   // Send notification to frontend
 *   this.notificationEmitter.sendProductNotification(
 *     event.createdBy,
 *     'product.created',
 *     { id: event.id, name: event.name, sku: event.sku }
 *   );
 * }
 * ```
 */
@Module({
  providers: [NotificationGateway, NotificationEmitterService],
  exports: [NotificationEmitterService],
})
export class NotificationModule {}
