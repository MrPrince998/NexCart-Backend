import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { Review } from './entities/review.entity';
import { CreateReviewDto, ModerateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async productReviews(productId: string) {
    return successResponse(
      await this.reviewRepository.find({
        where: { productId, isApproved: true },
        relations: { user: true },
        order: { createdAt: 'DESC' },
      }),
      'Reviews retrieved successfully',
    );
  }

  async mine(userId: string) {
    return successResponse(
      await this.reviewRepository.find({ where: { userId }, relations: { product: true } }),
      'Reviews retrieved successfully',
    );
  }

  async create(userId: string, dto: CreateReviewDto) {
    const review = this.reviewRepository.create({
      ...dto,
      userId,
      title: dto.title ?? null,
      comment: dto.comment ?? null,
    });
    return successResponse(await this.reviewRepository.save(review), 'Review submitted successfully', 201);
  }

  async moderate(id: string, dto: ModerateReviewDto) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    review.isApproved = dto.isApproved;
    return successResponse(await this.reviewRepository.save(review), 'Review moderated successfully');
  }

  async remove(id: string) {
    const result = await this.reviewRepository.softDelete(id);
    if (!result.affected) throw new NotFoundException('Review not found');
    return emptyReponse('Review deleted successfully');
  }
}
