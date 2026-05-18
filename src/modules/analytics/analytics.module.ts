import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from '@/modules/activity/entities/activity-log.entity';
import { ProductView } from '@/modules/activity/entities/product-view.entity';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { Order } from '@/modules/orders/entities/order.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { RecommendationScore } from '@/modules/recommendations/entities/recommendation-score.entity';
import { User } from '@/modules/users/entities/user.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivityLog,
      Order,
      OrderItem,
      Product,
      ProductView,
      RecommendationScore,
      User,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
