import { ActivityType } from '@/common/enums';
import { successResponse } from '@/common/handler/response.helper';
import { Product } from '@/modules/products/entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { ProductView } from './entities/product-view.entity';
import { TrackActivityDto } from './dto/track-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityRepository: Repository<ActivityLog>,
    @InjectRepository(ProductView)
    private readonly productViewRepository: Repository<ProductView>,
    private readonly dataSource: DataSource,
  ) {}

  async track(userId: string | null, dto: TrackActivityDto) {
    const result = await this.dataSource.transaction(async (manager) => {
      const activity = await manager.save(
        ActivityLog,
        manager.create(ActivityLog, {
          userId,
          type: dto.type,
          productId: dto.productId ?? null,
          sessionId: dto.sessionId ?? null,
          metadata: dto.metadata ?? null,
        }),
      );

      if (dto.type === ActivityType.PRODUCT_VIEW && dto.productId) {
        const product = await manager.findOne(Product, {
          where: { id: dto.productId },
        });
        if (!product) throw new NotFoundException('Product not found');
        product.viewCount += 1;
        await manager.save(Product, product);
        await manager.save(
          ProductView,
          manager.create(ProductView, {
            productId: dto.productId,
            userId,
            sessionId: dto.sessionId ?? null,
            source: dto.source ?? null,
          }),
        );
      }

      return activity;
    });

    return successResponse(result, 'Activity tracked successfully', 201);
  }

  async recentlyViewed(userId: string, limit = 10) {
    const views = await this.productViewRepository.find({
      where: { userId },
      relations: { product: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return successResponse(
      views.map((view) => view.product),
      'Recently viewed products retrieved successfully',
    );
  }

  async activityLogs() {
    return successResponse(
      await this.activityRepository.find({
        relations: { user: true, product: true },
        order: { createdAt: 'DESC' },
        take: 100,
      }),
      'Activity logs retrieved successfully',
    );
  }
}
