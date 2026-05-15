import { Injectable } from '@nestjs/common';
import { ProductCategory } from './entities/product-category.entity';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async softDeleteCategory(id: string) {
    const uncategorized = await this.categoryRepository.findOne({
      where: { slug: 'uncategorized' },
    });

    if (!uncategorized) {
      throw new Error('Uncategorized category not found');
    }

    await this.productRepo.update(
      { categoryId: id },
      { categoryId: uncategorized.id },
    );

    await this.categoryRepository.softDelete(id);
  }
}
