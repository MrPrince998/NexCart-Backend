import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/modules/products/entities/product.entity';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityLog } from './entities/activity-log.entity';
import { ProductView } from './entities/product-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog, ProductView, Product])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
