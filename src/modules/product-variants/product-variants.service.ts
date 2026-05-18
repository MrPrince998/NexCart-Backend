import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductVariantDto, UpdateProductVariantDto } from './dto/product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) {}

  async findByProduct(productId: string) {
    return successResponse(
      await this.variantRepository.find({
        where: { productId, isActive: true },
        order: { createdAt: 'ASC' },
      }),
      'Product variants retrieved successfully',
    );
  }

  async findAll() {
    return successResponse(
      await this.variantRepository.find({ order: { createdAt: 'DESC' } }),
      'Product variants retrieved successfully',
    );
  }

  async create(dto: CreateProductVariantDto) {
    const variant = this.variantRepository.create({
      ...dto,
      price: dto.price ?? null,
      discountPrice: dto.discountPrice ?? null,
      stock: dto.stock ?? 0,
      options: dto.options ?? null,
      isActive: dto.isActive ?? true,
    });
    return successResponse(await this.variantRepository.save(variant), 'Product variant created successfully', 201);
  }

  async update(id: string, dto: UpdateProductVariantDto) {
    const variant = await this.variantRepository.findOne({ where: { id } });
    if (!variant) throw new NotFoundException('Product variant not found');
    Object.assign(variant, dto);
    return successResponse(await this.variantRepository.save(variant), 'Product variant updated successfully');
  }

  async remove(id: string) {
    const result = await this.variantRepository.softDelete(id);
    if (!result.affected) throw new NotFoundException('Product variant not found');
    return emptyReponse('Product variant deleted successfully');
  }
}
