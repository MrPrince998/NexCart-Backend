import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ProductCreatedEvent,
  ProductUpdatedEvent,
  ProductDeletedEvent,
  ProductFeaturedEvent,
  ProductStatusChangedEvent,
} from '../events';
import { CacheService } from '@/integrations/cache';

/**
 * Product Event Listeners
 * Handles side effects from product domain events
 * - Cache invalidation
 * - Queue integration for async tasks
 * - Search index updates (TODO)
 */
@Injectable()
export class ProductEventListener {
  private readonly logger = new Logger(ProductEventListener.name);

  constructor(private readonly cacheService: CacheService) {}

  @OnEvent('product.created')
  async handleProductCreated(event: ProductCreatedEvent) {
    this.logger.log(
      `Product created: ${event.name} (${event.id}) - SKU: ${event.sku}`,
    );

    try {
      // Invalidate product list cache
      await this.cacheService.deletePattern('products:*');
      await this.cacheService.deletePattern('featured:*');

      this.logger.log(`Product created event handled: cache invalidated`);
    } catch (error) {
      this.logger.error(`Error handling product created event:`, error);
      // Continue - don't throw
    }
  }

  @OnEvent('product.updated')
  async handleProductUpdated(event: ProductUpdatedEvent) {
    this.logger.log(
      `Product updated: ${event.name} (${event.id}) - SKU: ${event.sku}`,
    );

    try {
      // Invalidate product cache (specific + list)
      await this.cacheService.delete(`product:${event.id}`);
      await this.cacheService.deletePattern('products:*');

      this.logger.log(`Product updated: caches invalidated`);
    } catch (error) {
      this.logger.error(`Error handling product updated event:`, error);
    }
  }

  @OnEvent('product.deleted')
  async handleProductDeleted(event: ProductDeletedEvent) {
    this.logger.log(
      `Product deleted: ${event.name} (${event.id}) - SKU: ${event.sku}`,
    );

    try {
      // Invalidate all product-related caches
      await this.cacheService.delete(`product:${event.id}`);
      await this.cacheService.deletePattern('products:*');
      await this.cacheService.deletePattern('featured:*');

      this.logger.log(`Product deleted: all related caches invalidated`);
    } catch (error) {
      this.logger.error(`Error handling product deleted event:`, error);
    }
  }

  @OnEvent('product.featured')
  async handleProductFeatured(event: ProductFeaturedEvent) {
    this.logger.log(
      `Product featured status changed: ${event.name} (${event.id}) - Featured: ${event.isFeatured}`,
    );

    try {
      // Invalidate featured products cache
      await this.cacheService.deletePattern('featured:*');

      this.logger.log(`Product featured: cache invalidated`);
    } catch (error) {
      this.logger.error(`Error handling product featured event:`, error);
    }
  }

  @OnEvent('product.status.changed')
  async handleProductStatusChanged(event: ProductStatusChangedEvent) {
    this.logger.log(
      `Product status changed: ${event.name} (${event.id}) - Status: ${event.status}`,
    );

    try {
      // Invalidate product cache
      await this.cacheService.delete(`product:${event.id}`);
      await this.cacheService.deletePattern('products:*');

      this.logger.log(`Product status changed: cache invalidated`);
    } catch (error) {
      this.logger.error(`Error handling product status changed event:`, error);
    }
  }
}
