import { RecommendationReason } from '@/common/enums';
import { successResponse } from '@/common/handler/response.helper';
import { ProductView } from '@/modules/activity/entities/product-view.entity';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationScore } from './entities/recommendation-score.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductView)
    private readonly viewRepository: Repository<ProductView>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(RecommendationScore)
    private readonly scoreRepository: Repository<RecommendationScore>,
  ) {}

  async popular(limit = 12) {
    const products = await this.productRepository.find({
      where: { status: 'active' as any },
      order: { salesCount: 'DESC', viewCount: 'DESC' },
      take: limit,
      relations: { category: true },
    });

    return successResponse(products, 'Popular products retrieved successfully');
  }

  async trending(limit = 12) {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const productIds = await this.viewRepository
      .createQueryBuilder('view')
      .select('view.productId', 'productId')
      .addSelect('COUNT(*)', 'viewCount')
      .where('view.createdAt >= :since', { since })
      .groupBy('view.productId')
      .orderBy('"viewCount"', 'DESC')
      .limit(limit)
      .getRawMany<{ productId: string }>();

    const products = await this.productsByOrderedIds(
      productIds.map((item) => item.productId),
    );

    return successResponse(products, 'Trending products retrieved successfully');
  }

  async similar(productId: string, limit = 8) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) return successResponse([], 'Similar products retrieved successfully');

    const products = await this.productRepository.find({
      where: { categoryId: product.categoryId, status: 'active' as any },
      order: { salesCount: 'DESC', viewCount: 'DESC' },
      take: limit + 1,
    });

    return successResponse(
      products.filter((item) => item.id !== productId).slice(0, limit),
      'Similar products retrieved successfully',
    );
  }

  async personalized(userId: string, limit = 12) {
    const scoreRows = await this.scoreRepository.find({
      where: { userId },
      relations: { product: true },
      order: { score: 'DESC' },
      take: limit,
    });

    if (scoreRows.length) {
      return successResponse(
        scoreRows.map((row) => row.product),
        'Personalized products retrieved successfully',
      );
    }

    const recentViews = await this.viewRepository.find({
      where: { userId },
      relations: { product: true },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const recentCategoryId = recentViews.find((view) => view.product)?.product
      .categoryId;
    if (recentCategoryId) {
      const products = await this.productRepository.find({
        where: { categoryId: recentCategoryId, status: 'active' as any },
        order: { salesCount: 'DESC', viewCount: 'DESC' },
        take: limit,
      });
      return successResponse(
        products,
        'Personalized products retrieved successfully',
      );
    }

    return this.popular(limit);
  }

  async rebuildPopularScores() {
    const products = await this.productRepository.find({
      order: { salesCount: 'DESC', viewCount: 'DESC' },
      take: 100,
    });

    const scores = products.map((product) =>
      this.scoreRepository.create({
        userId: null,
        productId: product.id,
        reason: RecommendationReason.POPULAR,
        score: product.salesCount * 5 + product.viewCount,
        metadata: {
          salesCount: product.salesCount,
          viewCount: product.viewCount,
        },
      }),
    );

    await this.scoreRepository.save(scores);
    return successResponse(scores, 'Recommendation scores rebuilt successfully');
  }

  private async productsByOrderedIds(ids: string[]) {
    if (!ids.length) return [];
    const products = await this.productRepository.findByIds(ids);
    const byId = new Map(products.map((product) => [product.id, product]));
    return ids.map((id) => byId.get(id)).filter(Boolean);
  }
}
