import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ProductCategoryCreatedEvent,
  ProductCategoryUpdatedEvent,
  ProductCategoryDeletedEvent,
  ProductCategoryStatusChangedEvent,
} from '../events';
import { CacheService } from '@/integrations/cache';

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

  constructor(private readonly cacheService: CacheService) {}

  @OnEvent('category.created')
  async handleCategoryCreated(event: ProductCategoryCreatedEvent) {
    this.logger.log(
      `Category created: ${event.name} (${event.id}) - Slug: ${event.slug}`,
    );

    try {
      // Invalidate all category caches
      await this.cacheService.deletePattern('categories:*');
      await this.cacheService.deletePattern('category:*');

      this.logger.log(`Category created: caches invalidated`);
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
