import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductView } from '@/modules/activity/entities/product-view.entity';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { RecommendationScore } from './entities/recommendation-score.entity';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductView,
      OrderItem,
      RecommendationScore,
    ]),
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule {}
