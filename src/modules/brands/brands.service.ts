import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { generateSlug } from '@/common/utils/generate-slug.util';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async findAll() {
    return successResponse(
      await this.brandRepository.find({ where: { isActive: true }, order: { name: 'ASC' } }),
      'Brands retrieved successfully',
    );
  }

  async findOne(idOrSlug: string) {
    const brand = await this.brandRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
      relations: { products: true },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    return successResponse(brand, 'Brand retrieved successfully');
  }

  async create(dto: CreateBrandDto) {
    const brand = this.brandRepository.create({
      name: dto.name,
      slug: await generateSlug(dto.name, this.brandRepository),
      description: dto.description ?? null,
      logoUrl: dto.logoUrl ?? null,
      websiteUrl: dto.websiteUrl ?? null,
      isActive: dto.isActive ?? true,
    });
    return successResponse(await this.brandRepository.save(brand), 'Brand created successfully', 201);
  }

  async update(id: string, dto: UpdateBrandDto) {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    if (dto.name && dto.name !== brand.name) {
      brand.slug = await generateSlug(dto.name, this.brandRepository);
    }
    Object.assign(brand, dto);
    return successResponse(await this.brandRepository.save(brand), 'Brand updated successfully');
  }

  async remove(id: string) {
    const result = await this.brandRepository.softDelete(id);
    if (!result.affected) throw new NotFoundException('Brand not found');
    return emptyReponse('Brand deleted successfully');
  }
}
