import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  ProductCategoryCreatedEvent,
  ProductCategoryUpdatedEvent,
  ProductCategoryDeletedEvent,
  ProductCategoryStatusChangedEvent,
} from '../events';
import { CacheService } from '@/integrations/cache';
import { EMAIL_QUEUE } from '@/jobs/queues';

/**
 * Category Event Listeners
 * Handles side effects from category domain events
 * - Cache invalidation
 * - Category hierarchy updates
 * - Admin notifications
 */
@Injectable()
export class CategoryEventListener {
  private readonly logger = new Logger(CategoryEventListener.name);

  constructor(
    private readonly cacheService: CacheService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  @OnEvent('category.created')
  async handleCategoryCreated(event: ProductCategoryCreatedEvent) {
    this.logger.log(
      `Category created: ${event.name} (${event.id}) - Slug: ${event.slug}`,
    );

    try {
      // Invalidate all category caches
      await this.cacheService.deletePattern('categories:*');
      await this.cacheService.deletePattern('category:*');

      // Queue admin notification
      await this.emailQueue.add('send-email', {
        to: process.env.ADMIN_EMAIL || 'admin@nexcart.com',
        subject: `New Category Created: ${event.name}`,
        template: 'category-created-admin',
        data: {
          categoryName: event.name,
          categoryId: event.id,
          slug: event.slug,
        },
      });

      this.logger.log(`Category created: caches invalidated, admin notified`);
    } catch (error) {
      this.logger.error(`Error handling category created event:`, error);
    }
  }

  @OnEvent('category.updated')
  async handleCategoryUpdated(event: ProductCategoryUpdatedEvent) {
    this.logger.log(
      `Category updated: ${event.name} (${event.id}) - Slug: ${event.slug}`,
    );

    try {
      // Invalidate category cache
      await this.cacheService.delete(`category:${event.id}`);
      await this.cacheService.deletePattern('categories:*');
      // Also invalidate parent/children hierarchy caches
      if (event.parentCategoryId) {
        await this.cacheService.delete(
          `category:${event.parentCategoryId}:children`,
        );
      }

      this.logger.log(`Category updated: caches invalidated`);
    } catch (error) {
      this.logger.error(`Error handling category updated event:`, error);
    }
  }

  @OnEvent('category.deleted')
  async handleCategoryDeleted(event: ProductCategoryDeletedEvent) {
    this.logger.log(
      `Category deleted: ${event.name} (${event.id}) - Slug: ${event.slug}`,
    );

    try {
      // Invalidate all category caches
      await this.cacheService.delete(`category:${event.id}`);
      await this.cacheService.deletePattern('categories:*');
      await this.cacheService.deletePattern(`category:${event.id}:*`);

      this.logger.log(`Category deleted: all related caches invalidated`);
    } catch (error) {
      this.logger.error(`Error handling category deleted event:`, error);
    }
  }

  @OnEvent('category.status.changed')
  async handleCategoryStatusChanged(event: ProductCategoryStatusChangedEvent) {
    this.logger.log(
      `Category status changed: ${event.name} (${event.id}) - Active: ${event.isActive}`,
    );

    try {
      // Invalidate category cache
      await this.cacheService.delete(`category:${event.id}`);
      await this.cacheService.deletePattern('categories:*');

      this.logger.log(`Category status changed: cache invalidated`);
    } catch (error) {
      this.logger.error(`Error handling category status changed event:`, error);
    }
  }
}
