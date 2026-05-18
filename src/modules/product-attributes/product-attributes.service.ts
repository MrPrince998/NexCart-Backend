import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { generateSlug } from '@/common/utils/generate-slug.util';
import { ProductAttribute } from './entities/product-attribute.entity';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';
import {
  CreateProductAttributeDto,
  SetProductAttributeValueDto,
  UpdateProductAttributeDto,
} from './dto/product-attribute.dto';

@Injectable()
export class ProductAttributesService {
  constructor(
    @InjectRepository(ProductAttribute)
    private readonly attributeRepository: Repository<ProductAttribute>,
    @InjectRepository(ProductAttributeValue)
    private readonly valueRepository: Repository<ProductAttributeValue>,
  ) {}

  async findAll(categoryId?: string) {
    return successResponse(
      await this.attributeRepository.find({
        where: categoryId ? { categoryId } : {},
        order: { sortOrder: 'ASC', name: 'ASC' },
      }),
      'Product attributes retrieved successfully',
    );
  }

  async create(dto: CreateProductAttributeDto) {
    const attribute = this.attributeRepository.create({
      ...dto,
      slug: await generateSlug(dto.name, this.attributeRepository),
      categoryId: dto.categoryId ?? null,
      options: dto.options ?? null,
      isRequired: dto.isRequired ?? false,
      isFilterable: dto.isFilterable ?? true,
      isComparable: dto.isComparable ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });
    return successResponse(await this.attributeRepository.save(attribute), 'Product attribute created successfully', 201);
  }

  async update(id: string, dto: UpdateProductAttributeDto) {
    const attribute = await this.attributeRepository.findOne({ where: { id } });
    if (!attribute) throw new NotFoundException('Product attribute not found');
    if (dto.name && dto.name !== attribute.name) {
      attribute.slug = await generateSlug(dto.name, this.attributeRepository);
    }
    Object.assign(attribute, dto);
    return successResponse(await this.attributeRepository.save(attribute), 'Product attribute updated successfully');
  }

  async remove(id: string) {
    const result = await this.attributeRepository.softDelete(id);
    if (!result.affected) throw new NotFoundException('Product attribute not found');
    return emptyReponse('Product attribute deleted successfully');
  }

  async values(productId: string) {
    return successResponse(
      await this.valueRepository.find({
        where: { productId },
        relations: { attribute: true },
      }),
      'Product attribute values retrieved successfully',
    );
  }

  async setValue(dto: SetProductAttributeValueDto) {
    const queryBuilder = this.valueRepository
      .createQueryBuilder('value')
      .where('value.productId = :productId', { productId: dto.productId })
      .andWhere('value.attributeId = :attributeId', {
        attributeId: dto.attributeId,
      });

    if (dto.variantId) {
      queryBuilder.andWhere('value.variantId = :variantId', {
        variantId: dto.variantId,
      });
    } else {
      queryBuilder.andWhere('value.variantId IS NULL');
    }

    let value = await queryBuilder.getOne();

    value ??= this.valueRepository.create({
      productId: dto.productId,
      attributeId: dto.attributeId,
      variantId: dto.variantId ?? null,
    });

    value.value = dto.value;
    value.numericValue = Number.isFinite(Number(dto.value)) ? Number(dto.value) : null;
    value.booleanValue =
      dto.value === 'true' ? true : dto.value === 'false' ? false : null;

    return successResponse(await this.valueRepository.save(value), 'Product attribute value saved successfully');
  }
}
