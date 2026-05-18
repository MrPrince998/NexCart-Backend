import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refund } from './entities/refund.entity';
import { ReturnRequest } from './entities/return-request.entity';
import { ReturnsController } from './returns.controller';
import { ReturnsService } from './returns.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReturnRequest, Refund])],
  controllers: [ReturnsController],
  providers: [ReturnsService],
})
export class ReturnsModule {}
