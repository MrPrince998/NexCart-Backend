import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ProductStatus } from '@/common/enums';
import { successResponse } from '@/common/handler/response.helper';
import { ActivityLog } from '@/modules/activity/entities/activity-log.entity';
import { ProductView } from '@/modules/activity/entities/product-view.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { RecommendationScore } from '@/modules/recommendations/entities/recommendation-score.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Order } from '@/modules/orders/entities/order.entity';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(ActivityLog)
    private readonly activityRepository: Repository<ActivityLog>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductView)
    private readonly productViewRepository: Repository<ProductView>,
    @InjectRepository(RecommendationScore)
    private readonly recommendationRepository: Repository<RecommendationScore>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async dashboard() {
    const [orders, products, users, revenueRaw, topProducts, recentOrders] =
      await Promise.all([
        this.orderRepository.count(),
        this.productRepository.count(),
        this.userRepository.count(),
        this.orderRepository
          .createQueryBuilder('order')
          .select('COALESCE(SUM(order.total), 0)', 'revenue')
          .getRawOne<{ revenue: string }>(),
        this.orderItemRepository
          .createQueryBuilder('item')
          .select('item.productId', 'productId')
          .addSelect('item.productName', 'productName')
          .addSelect('SUM(item.quantity)', 'quantitySold')
          .addSelect('SUM(item.lineTotal)', 'revenue')
          .groupBy('item.productId')
          .addGroupBy('item.productName')
          .orderBy('"quantitySold"', 'DESC')
          .limit(5)
          .getRawMany<{
            productId: string;
            productName: string;
            quantitySold: string;
            revenue: string;
          }>(),
        this.orderRepository.find({
          order: { createdAt: 'DESC' },
          take: 5,
          relations: { items: true },
        }),
      ]);

    const activeProducts = await this.productRepository.count({
      where: { status: ProductStatus.ACTIVE },
    });

    return successResponse(
      {
        totals: {
          orders,
          products,
          activeProducts,
          users,
          revenue: Number(revenueRaw?.revenue ?? 0),
        },
        topProducts: topProducts.map((product) => ({
          ...product,
          quantitySold: Number(product.quantitySold),
          revenue: Number(product.revenue),
        })),
        recentOrders,
      },
      'Dashboard analytics retrieved successfully',
    );
  }

  async salesSummary(startDate?: Date, endDate?: Date) {
    const where =
      startDate && endDate ? { createdAt: Between(startDate, endDate) } : {};

    const [orderCount, revenueRaw] = await Promise.all([
      this.orderRepository.count({ where }),
      this.orderRepository
        .createQueryBuilder('order')
        .select('COALESCE(SUM(order.total), 0)', 'revenue')
        .where(
          startDate && endDate
            ? 'order.createdAt BETWEEN :startDate AND :endDate'
            : '1 = 1',
          { startDate, endDate },
        )
        .getRawOne<{ revenue: string }>(),
    ]);

    return successResponse(
      {
        orderCount,
        revenue: Number(revenueRaw?.revenue ?? 0),
        averageOrderValue:
          orderCount > 0 ? Number(revenueRaw?.revenue ?? 0) / orderCount : 0,
      },
      'Sales summary retrieved successfully',
    );
  }

  async behaviorSummary() {
    const [activityCount, productViewCount, topViewedProducts, searchTerms] =
      await Promise.all([
        this.activityRepository.count(),
        this.productViewRepository.count(),
        this.productViewRepository
          .createQueryBuilder('view')
          .leftJoin('view.product', 'product')
          .select('view.productId', 'productId')
          .addSelect('product.name', 'productName')
          .addSelect('COUNT(*)', 'views')
          .groupBy('view.productId')
          .addGroupBy('product.name')
          .orderBy('"views"', 'DESC')
          .limit(10)
          .getRawMany(),
        this.activityRepository
          .createQueryBuilder('activity')
          .select("activity.metadata ->> 'query'", 'query')
          .addSelect('COUNT(*)', 'count')
          .where('activity.type = :type', { type: 'search' })
          .andWhere("activity.metadata ? 'query'")
          .groupBy("activity.metadata ->> 'query'")
          .orderBy('"count"', 'DESC')
          .limit(10)
          .getRawMany(),
      ]);

    return successResponse(
      {
        activityCount,
        productViewCount,
        topViewedProducts: topViewedProducts.map((item) => ({
          ...item,
          views: Number(item.views),
        })),
        searchTerms: searchTerms.map((item) => ({
          ...item,
          count: Number(item.count),
        })),
      },
      'Behavior analytics retrieved successfully',
    );
  }

  async recommendationSummary() {
    const scores = await this.recommendationRepository
      .createQueryBuilder('score')
      .select('score.reason', 'reason')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(score.score)', 'averageScore')
      .groupBy('score.reason')
      .orderBy('"count"', 'DESC')
      .getRawMany();

    return successResponse(
      scores.map((item) => ({
        reason: item.reason,
        count: Number(item.count),
        averageScore: Number(item.averageScore ?? 0),
      })),
      'Recommendation analytics retrieved successfully',
    );
  }
}
