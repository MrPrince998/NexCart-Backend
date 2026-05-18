import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttribute } from './entities/product-attribute.entity';
import { ProductAttributeValue } from './entities/product-attribute-value.entity';
import { ProductAttributesController } from './product-attributes.controller';
import { ProductAttributesService } from './product-attributes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttribute, ProductAttributeValue])],
  controllers: [ProductAttributesController],
  providers: [ProductAttributesService],
})
export class ProductAttributesModule {}
