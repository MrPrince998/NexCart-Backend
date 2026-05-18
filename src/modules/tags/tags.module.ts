import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { ProductTag } from './entities/product-tag.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, ProductTag])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
