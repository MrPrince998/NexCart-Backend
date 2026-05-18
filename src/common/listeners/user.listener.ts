import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
  UserEmailVerifiedEvent,
  UserStatusChangedEvent,
} from '../events';
import { CacheService } from '@/integrations/cache';
import { EMAIL_QUEUE, NOTIFICATION_QUEUE } from '@/jobs/queues';

/**
 * User Event Listeners
 * Handles side effects from user domain events
 * - Cache invalidation
 * - Email and notification queuing
 * - Account status changes
 * - Audit logging (TODO)
 */
@Injectable()
export class UserEventListener {
  private readonly logger = new Logger(UserEventListener.name);

  constructor(
    private readonly cacheService: CacheService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
  ) {}

  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent) {
    this.logger.log(
      `User created: ${event.email} (${event.id}) - Name: ${event.name}`,
    );

    try {
      // Queue welcome email with verification link
      await this.emailQueue.add('send-email', {
        to: event.email,
        subject: 'Welcome to NexCart!',
        template: 'welcome',
        data: {
          userName: event.name,
          verificationLink: `${process.env.APP_URL}/verify-email/${event.id}`,
          email: event.email,
        },
      });

      this.logger.log(`User created: welcome email queued`);
    } catch (error) {
      this.logger.error(`Error handling user created event:`, error);
    }
  }

  @OnEvent('user.updated')
  async handleUserUpdated(event: UserUpdatedEvent) {
    this.logger.log(
      `User updated: ${event.email} (${event.id}) - Name: ${event.name}`,
    );

    try {
      // Invalidate user cache
      await this.cacheService.delete(`user:${event.id}`);
      await this.cacheService.delete(`user:${event.email}`);

      this.logger.log(`User updated: cache invalidated`);
    } catch (error) {
      this.logger.error(`Error handling user updated event:`, error);
    }
  }

  @OnEvent('user.deleted')
  async handleUserDeleted(event: UserDeletedEvent) {
    this.logger.log(`User deleted: ${event.email} (${event.id})`);

    try {
      // Invalidate user cache
      await this.cacheService.delete(`user:${event.id}`);
      await this.cacheService.delete(`user:${event.email}`);
      await this.cacheService.deletePattern(`user:${event.id}:*`);

      // Queue farewell email
      await this.emailQueue.add('send-email', {
        to: event.email,
        subject: 'We will miss you!',
        template: 'farewell',
        data: {
          userName: event.email.split('@')[0],
        },
      });

      this.logger.log(`User deleted: cache cleared, farewell email queued`);
    } catch (error) {
      this.logger.error(`Error handling user deleted event:`, error);
    }
  }

  @OnEvent('user.email.verified')
  async handleUserEmailVerified(event: UserEmailVerifiedEvent) {
    this.logger.log(`User email verified: ${event.email} (${event.id})`);

    try {
      // Invalidate user cache
      await this.cacheService.delete(`user:${event.id}`);

      // Queue confirmation email
      await this.emailQueue.add('send-email', {
        to: event.email,
        subject: 'Email Verified Successfully',
        template: 'email-verified',
        data: {
          email: event.email,
          dashboardUrl: `${process.env.APP_URL}/dashboard`,
        },
      });

      // Send in-app notification
      await this.notificationQueue.add('send-notification', {
        userId: event.id,
        title: 'Email Verified',
        message: 'Your email has been verified successfully!',
        type: 'success',
      });

      this.logger.log(
        `User email verified: confirmation email and notification queued`,
      );
    } catch (error) {
      this.logger.error(`Error handling user email verified event:`, error);
    }
  }

  @OnEvent('user.status.changed')
  async handleUserStatusChanged(event: UserStatusChangedEvent) {
    this.logger.log(
      `User status changed: ${event.email} (${event.id}) - Status: ${event.status}`,
    );

    try {
      // Invalidate user cache
      await this.cacheService.delete(`user:${event.id}`);

      // Queue notification based on status
      const statusMessages: Record<
        string,
        { subject: string; template: string }
      > = {
        blocked: {
          subject: 'Account Suspended',
          template: 'account-blocked',
        },
        suspended: {
          subject: 'Account Suspended',
          template: 'account-suspended',
        },
        active: {
          subject: 'Account Reactivated',
          template: 'account-active',
        },
      };

      const statusInfo = statusMessages[event.status];
      if (statusInfo) {
        await this.emailQueue.add('send-email', {
          to: event.email,
          subject: statusInfo.subject,
          template: statusInfo.template,
          data: {
            email: event.email,
            status: event.status,
          },
        });
      }

      this.logger.log(`User status changed: notification queued`);
    } catch (error) {
      this.logger.error(`Error handling user status changed event:`, error);
    }
  }
}
