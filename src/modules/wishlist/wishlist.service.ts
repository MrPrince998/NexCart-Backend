import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/modules/products/entities/product.entity';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { WishlistItem } from './entities/wishlist-item.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistRepository: Repository<WishlistItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(userId: string) {
    const items = await this.wishlistRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return successResponse(items, 'Wishlist retrieved successfully');
  }

  async add(userId: string, productId: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    if (existing) {
      return successResponse(existing, 'Product already exists in wishlist');
    }

    const item = await this.wishlistRepository.save(
      this.wishlistRepository.create({ userId, productId }),
    );

    return successResponse(item, 'Product added to wishlist');
  }

  async remove(userId: string, productId: string) {
    const result = await this.wishlistRepository.delete({ userId, productId });
    if (!result.affected) throw new NotFoundException('Wishlist item not found');

    return emptyReponse('Product removed from wishlist');
  }
}
