import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Image } from '@/modules/images/entities/image.entity';
import { CloudinaryModule } from '@/integrations/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Image]), CloudinaryModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
