import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '@/integrations/cloudinary/cloudinary.module';
import { Image } from './entities/image.entity';
import { ImagesController } from './images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), CloudinaryModule],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
