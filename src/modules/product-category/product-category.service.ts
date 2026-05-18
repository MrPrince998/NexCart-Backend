import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductCategory } from './entities/product-category.entity';
import { Brackets, IsNull, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductCategoryDeletedEvent } from '@/common/events';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { paginate } from '@/common/handler/pagination.helper';
import { generateSlug } from '@/common/utils/generate-slug.util';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategoryQueryDto } from './dto/product-category-query.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateProductCategoryDto) {
    await this.validateParent(dto.parentCategoryId);

    const category = this.categoryRepository.create({
      name: dto.name,
      slug: await generateSlug(dto.name, this.categoryRepository),
      description: dto.description ?? null,
      image: dto.image ?? null,
      parentCategoryId: dto.parentCategoryId ?? null,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });

    return successResponse(
      await this.categoryRepository.save(category),
      'Category created successfully',
      201,
    );
  }

  async findAll(query: ProductCategoryQueryDto = {}) {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .loadRelationCountAndMap('category.productCount', 'category.products')
      .where('category.deletedAt IS NULL');

    if (query.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('category.name ILIKE :search', {
            search: `%${query.search}%`,
          }).orWhere('category.slug ILIKE :search', {
            search: `%${query.search}%`,
          });
        }),
      );
    }

    if (typeof query.isActive === 'boolean') {
      queryBuilder.andWhere('category.isActive = :isActive', {
        isActive: query.isActive,
      });
    }

    if (query.parentCategoryId) {
      queryBuilder.andWhere('category.parentCategoryId = :parentCategoryId', {
        parentCategoryId: query.parentCategoryId,
      });
    }

    queryBuilder
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.createdAt', 'DESC');

    return paginate(queryBuilder, query, 'Categories retrieved successfully');
  }

  async findTree() {
    const categories = await this.categoryRepository.find({
      where: { isActive: true },
      relations: { children: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    const roots = categories.filter((category) => !category.parentCategoryId);
    return successResponse(roots, 'Category tree retrieved successfully');
  }

  async findOne(idOrSlug: string) {
    const category = await this.categoryRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
      relations: { parent: true, children: true, products: true },
    });

    if (!category) throw new NotFoundException('Category not found');
    return successResponse(category, 'Category retrieved successfully');
  }

  async update(id: string, dto: UpdateProductCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    if (dto.parentCategoryId === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }

    await this.validateParent(dto.parentCategoryId);

    if (dto.name && dto.name !== category.name) {
      category.slug = await generateSlug(dto.name, this.categoryRepository);
    }

    Object.assign(category, {
      ...dto,
      description: dto.description ?? category.description,
      image: dto.image ?? category.image,
      parentCategoryId:
        dto.parentCategoryId === undefined
          ? category.parentCategoryId
          : dto.parentCategoryId,
    });

    return successResponse(
      await this.categoryRepository.save(category),
      'Category updated successfully',
    );
  }

  async softDeleteCategory(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const uncategorized = await this.categoryRepository.findOne({
      where: { slug: 'uncategorized' },
    });

    if (!uncategorized) {
      throw new NotFoundException('Uncategorized category not found');
    }

    await this.productRepo.update(
      { categoryId: id },
      { categoryId: uncategorized.id },
    );

    await this.categoryRepository.softDelete(id);

    // Emit category deleted event
    this.eventEmitter.emit(
      'category.deleted',
      new ProductCategoryDeletedEvent(
        category.id,
        category.name,
        category.slug,
        new Date(),
      ),
    );

    return emptyReponse('Category deleted successfully');
  }

  private async validateParent(parentCategoryId?: string | null) {
    if (!parentCategoryId) return;

    const parent = await this.categoryRepository.findOne({
      where: { id: parentCategoryId },
    });

    if (!parent) throw new NotFoundException('Parent category not found');
  }
}
