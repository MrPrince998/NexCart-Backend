import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingRate } from './entities/shipping-rate.entity';
import { ShippingZone } from './entities/shipping-zone.entity';
import { ShippingRatesController } from './shipping-rates.controller';
import { ShippingRatesService } from './shipping-rates.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingZone, ShippingRate])],
  controllers: [ShippingRatesController],
  providers: [ShippingRatesService],
})
export class ShippingRatesModule {}
