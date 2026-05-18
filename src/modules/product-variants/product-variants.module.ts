import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductVariantsController } from './product-variants.controller';
import { ProductVariantsService } from './product-variants.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant, ProductImage])],
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService],
})
export class ProductVariantsModule {}
