import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateSlug } from '@/common/utils/generate-slug.util';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { Tag } from './entities/tag.entity';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll() {
    return successResponse(
      await this.tagRepository.find({ order: { name: 'ASC' } }),
      'Tags retrieved successfully',
    );
  }

  async create(dto: CreateTagDto) {
    const tag = this.tagRepository.create({
      name: dto.name,
      slug: await generateSlug(dto.name, this.tagRepository),
    });
    return successResponse(await this.tagRepository.save(tag), 'Tag created successfully', 201);
  }

  async update(id: string, dto: UpdateTagDto) {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    if (dto.name !== tag.name) tag.slug = await generateSlug(dto.name, this.tagRepository);
    tag.name = dto.name;
    return successResponse(await this.tagRepository.save(tag), 'Tag updated successfully');
  }

  async remove(id: string) {
    const result = await this.tagRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Tag not found');
    return emptyReponse('Tag deleted successfully');
  }
}
