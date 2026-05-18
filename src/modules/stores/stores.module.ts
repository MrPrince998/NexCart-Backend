import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/modules/products/entities/product.entity';
import { Store } from './entities/store.entity';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Product])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
