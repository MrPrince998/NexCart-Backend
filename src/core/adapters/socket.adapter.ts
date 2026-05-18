import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { setupRedisAdapter } from '../adapters/redis-io.adapter';

/**
 * Notification WebSocket Gateway
 * Handles real-time notification delivery to connected clients
 * Supports broadcasting to specific users or all users
 *
 * Flow:
 * 1. Domain event emitted
 * 2. Event listener saves to database
 * 3. NotificationEmitterService broadcasts to connected clients via this gateway
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(NotificationGateway.name);

  async afterInit() {
    this.logger.log('🔌 Notification gateway initialized');

    // Setup Redis adapter for distributed Socket.IO across multiple server instances
    await setupRedisAdapter(this.server);
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (userId) {
      // Join user-specific room for targeted notifications
      client.join(`user:${userId}`);
      this.logger.debug(`✨ User ${userId} connected (socket: ${client.id})`);
    } else {
      this.logger.warn(
        `⚠️ Client connected without userId (socket: ${client.id})`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.logger.debug(
        `👋 User ${userId} disconnected (socket: ${client.id})`,
      );
    }
  }

  /**
   * Broadcast notification to specific user
   * Used internally by NotificationEmitterService
   */
  sendToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
    this.logger.debug(`📨 Notification sent to user ${userId}`);
  }

  /**
   * Broadcast notification to all connected users
   * Used for system-wide announcements
   */
  broadcastToAll(notification: any) {
    this.server.emit('notification', notification);
    this.logger.debug('📢 Notification broadcasted to all users');
  }

  /**
   * Broadcast notification to multiple users
   */
  sendToMultiple(userIds: string[], notification: any) {
    userIds.forEach((userId) => {
      this.sendToUser(userId, notification);
    });
  }
}
