import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { ProductStatus } from '@/common/enums';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getCart(userId: string) {
    const items = await this.cartRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return successResponse(this.toCartSummary(items), 'Cart retrieved successfully');
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    await this.ensureProductCanBePurchased(dto.productId);

    const existing = await this.cartRepository.findOne({
      where: { userId, productId: dto.productId },
    });

    const item = existing
      ? this.cartRepository.merge(existing, {
          quantity: existing.quantity + dto.quantity,
        })
      : this.cartRepository.create({ userId, ...dto });

    await this.cartRepository.save(item);
    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.cartRepository.findOne({ where: { id: itemId, userId } });
    if (!item) throw new NotFoundException('Cart item not found');

    item.quantity = dto.quantity;
    await this.cartRepository.save(item);
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const result = await this.cartRepository.delete({ id: itemId, userId });
    if (!result.affected) throw new NotFoundException('Cart item not found');
    return emptyReponse('Cart item removed successfully');
  }

  async clear(userId: string) {
    await this.cartRepository.delete({ userId });
    return emptyReponse('Cart cleared successfully');
  }

  private async ensureProductCanBePurchased(productId: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.status !== ProductStatus.ACTIVE) {
      throw new BadRequestException('Product is not available for purchase');
    }
  }

  private toCartSummary(items: CartItem[]) {
    const subtotal = items.reduce((sum, item) => {
      const unitPrice = Number(item.product.discountPrice ?? item.product.price);
      return sum + unitPrice * item.quantity;
    }, 0);

    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
    };
  }
}
