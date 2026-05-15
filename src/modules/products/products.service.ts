import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { generateSlug } from '@/common/utils/generate-slug.util';
import { generateSku } from '@/common/utils/sku.util';
import { paginate } from '@/common/handler/pagination.helper';
import { ProductStatus } from '@/common/enums';
import {
  emptyReponse,
  successResponse,
} from '@/common/handler/response.helper';
import { ProductQueryDto } from './dto/product-query.dto';

const PRODUCT_SORT_COLUMNS = {
  createdAt: 'product.createdAt',
  updatedAt: 'product.updatedAt',
  name: 'product.name',
} as const;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    const slug = await generateSlug(dto.name, this.productRepository);
    const sku = generateSku(dto.brand, dto.name);

    const product = this.productRepository.create({
      ...dto,
      slug,
      sku,
    });

    const savedProduct = await this.productRepository.save(product);
    return successResponse(savedProduct, 'Product created successfully', 201);
  }

  async findAll(pagination: ProductQueryDto = {}) {
    const sortColumn =
      PRODUCT_SORT_COLUMNS[pagination.sortBy ?? 'createdAt'] ??
      PRODUCT_SORT_COLUMNS.createdAt;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.deletedAt IS NULL');

    if (pagination.q) {
      queryBuilder.andWhere(
        `(product.name ILIKE :search OR product.brand ILIKE :search OR product.sku ILIKE :search)`,
        { search: `%${pagination.q}%` },
      );
    }

    if (pagination.category) {
      queryBuilder.andWhere(
        '(product.categoryId = :category OR category.slug = :category)',
        {
          category: pagination.category,
        },
      );
    }

    if (pagination.brand) {
      queryBuilder.andWhere('product.brand ILIKE :brand', {
        brand: pagination.brand,
      });
    }

    queryBuilder.andWhere('product.status = :status', {
      status: pagination.status ?? ProductStatus.ACTIVE,
    });

    queryBuilder.orderBy(sortColumn, pagination.sortOrder ?? 'DESC');

    return paginate(queryBuilder, pagination, 'Products retrieved successfully');
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) throw new NotFoundException('Product not found');

    return successResponse(product, 'Product retrieved successfully');
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) throw new NotFoundException('Product not found');

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      product.slug = await generateSlug(
        updateProductDto.name,
        this.productRepository,
      );
    }

    if (
      (updateProductDto.name && updateProductDto.name !== product.name) ||
      (updateProductDto.brand && updateProductDto.brand !== product.brand)
    ) {
      product.sku = generateSku(
        updateProductDto.brand ?? product.brand,
        updateProductDto.name ?? product.name,
      );
    }

    Object.assign(product, updateProductDto);

    const updatedProduct = await this.productRepository.save(product);
    return successResponse(updatedProduct, 'Product updated successfully');
  }

  async remove(id: string) {
    const result = await this.productRepository.softDelete(id);

    if (!result.affected) throw new NotFoundException('Product not found');

    return emptyReponse('Product deleted successfully');
  }
}
