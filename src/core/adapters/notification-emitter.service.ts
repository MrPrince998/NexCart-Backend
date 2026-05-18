import { Injectable, Logger } from '@nestjs/common';
import { NotificationGateway } from '../adapters/socket.adapter';

export interface Notification {
  type: string; // 'product.created', 'user.registered', 'order.completed', etc.
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp?: Date;
}

/**
 * Notification Emitter Service
 * Responsible for sending real-time notifications to connected users via WebSocket
 *
 * Used by event listeners to forward notifications to frontend:
 * Event Emitter → Event Listener → DB Save + NotificationEmitterService
 */
@Injectable()
export class NotificationEmitterService {
  private readonly logger = new Logger(NotificationEmitterService.name);

  constructor(private readonly notificationGateway: NotificationGateway) {}

  /**
   * Send notification to specific user
   */
  sendToUser(userId: string, notification: Notification) {
    try {
      this.notificationGateway.sendToUser(userId, {
        ...notification,
        timestamp: notification.timestamp || new Date(),
      });
      this.logger.log(
        `✉️ Notification "${notification.type}" sent to user ${userId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to send notification to user ${userId}:`,
        error,
      );
    }
  }

  /**
   * Send notification to multiple users
   */
  sendToMultiple(userIds: string[], notification: Notification) {
    try {
      this.notificationGateway.sendToMultiple(userIds, {
        ...notification,
        timestamp: notification.timestamp || new Date(),
      });
      this.logger.log(
        `✉️ Notification "${notification.type}" sent to ${userIds.length} users`,
      );
    } catch (error) {
      this.logger.error(`❌ Failed to send bulk notification:`, error);
    }
  }

  /**
   * Broadcast notification to all connected users
   */
  broadcastToAll(notification: Notification) {
    try {
      this.notificationGateway.broadcastToAll({
        ...notification,
        timestamp: notification.timestamp || new Date(),
      });
      this.logger.log(
        `📢 Notification "${notification.type}" broadcasted to all users`,
      );
    } catch (error) {
      this.logger.error(`❌ Failed to broadcast notification:`, error);
    }
  }

  /**
   * Send product notification
   */
  sendProductNotification(
    userId: string,
    type:
      | 'product.created'
      | 'product.updated'
      | 'product.deleted'
      | 'product.featured',
    product: { id: string; name: string; sku?: string },
    message?: string,
  ) {
    this.sendToUser(userId, {
      type,
      title: `Product ${type.split('.')[1]}`,
      message:
        message || `Product "${product.name}" has been ${type.split('.')[1]}`,
      data: product,
    });
  }

  /**
   * Send user notification
   */
  sendUserNotification(
    userId: string,
    type:
      | 'user.registered'
      | 'user.updated'
      | 'user.email.verified'
      | 'user.status.changed',
    message: string,
    data?: Record<string, any>,
  ) {
    this.sendToUser(userId, {
      type,
      title: `Account ${type.split('.')[1]}`,
      message,
      data,
    });
  }

  /**
   * Send category notification
   */
  sendCategoryNotification(
    userIds: string[],
    type: 'category.created' | 'category.updated' | 'category.deleted',
    category: { id: string; name: string; slug: string },
    message?: string,
  ) {
    this.sendToMultiple(userIds, {
      type,
      title: `Category ${type.split('.')[1]}`,
      message:
        message || `Category "${category.name}" has been ${type.split('.')[1]}`,
      data: category,
    });
  }
}
