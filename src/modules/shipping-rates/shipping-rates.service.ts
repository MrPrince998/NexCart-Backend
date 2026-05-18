import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { ShippingRate } from './entities/shipping-rate.entity';
import { ShippingZone } from './entities/shipping-zone.entity';
import {
  CreateShippingRateDto,
  CreateShippingZoneDto,
  CalculateShippingRatesDto,
  UpdateShippingRateDto,
  UpdateShippingZoneDto,
} from './dto/shipping-rate.dto';

@Injectable()
export class ShippingRatesService {
  constructor(
    @InjectRepository(ShippingZone)
    private readonly zoneRepository: Repository<ShippingZone>,
    @InjectRepository(ShippingRate)
    private readonly rateRepository: Repository<ShippingRate>,
  ) {}

  async zones() {
    return successResponse(
      await this.zoneRepository.find({ relations: { rates: true }, order: { name: 'ASC' } }),
      'Shipping zones retrieved successfully',
    );
  }

  async createZone(dto: CreateShippingZoneDto) {
    const zone = this.zoneRepository.create({
      ...dto,
      description: dto.description ?? null,
      states: dto.states ?? null,
      isActive: dto.isActive ?? true,
    });
    return successResponse(await this.zoneRepository.save(zone), 'Shipping zone created successfully', 201);
  }

  async updateZone(id: string, dto: UpdateShippingZoneDto) {
    const zone = await this.zoneRepository.findOne({ where: { id } });
    if (!zone) throw new NotFoundException('Shipping zone not found');
    Object.assign(zone, dto);
    return successResponse(await this.zoneRepository.save(zone), 'Shipping zone updated successfully');
  }

  async deleteZone(id: string) {
    const result = await this.zoneRepository.softDelete(id);
    if (!result.affected) throw new NotFoundException('Shipping zone not found');
    return emptyReponse('Shipping zone deleted successfully');
  }

  async rates(zoneId?: string) {
    return successResponse(
      await this.rateRepository.find({
        where: zoneId ? { zoneId } : {},
        relations: { zone: true },
        order: { price: 'ASC' },
      }),
      'Shipping rates retrieved successfully',
    );
  }

  async calculate(dto: CalculateShippingRatesDto) {
    const rates = await this.rateRepository.find({
      where: { isActive: true },
      relations: { zone: true },
      order: { price: 'ASC' },
    });

    const country = dto.country.toUpperCase();
    const state = dto.state.toUpperCase();

    const applicableRates = rates.filter((rate) => {
      if (!rate.zone.isActive) return false;
      const countries = rate.zone.countries.map((item) => item.toUpperCase());
      const states = rate.zone.states?.map((item) => item.toUpperCase()) ?? [];

      const countryMatches = countries.includes(country);
      const stateMatches = !states.length || states.includes(state);
      const minMatches =
        !rate.minOrderAmount || dto.orderAmount >= Number(rate.minOrderAmount);
      const maxMatches =
        !rate.maxOrderAmount || dto.orderAmount <= Number(rate.maxOrderAmount);

      return countryMatches && stateMatches && minMatches && maxMatches;
    });

    return successResponse(
      applicableRates,
      'Applicable shipping rates retrieved successfully',
    );
  }

  async createRate(dto: CreateShippingRateDto) {
    const rate = this.rateRepository.create({
      ...dto,
      currency: dto.currency ?? 'USD',
      minOrderAmount: dto.minOrderAmount ?? null,
      maxOrderAmount: null,
      minWeight: null,
      maxWeight: null,
      estimatedDaysMin: null,
      estimatedDaysMax: null,
      isActive: dto.isActive ?? true,
    });
    return successResponse(await this.rateRepository.save(rate), 'Shipping rate created successfully', 201);
  }

  async updateRate(id: string, dto: UpdateShippingRateDto) {
    const rate = await this.rateRepository.findOne({ where: { id } });
    if (!rate) throw new NotFoundException('Shipping rate not found');
    Object.assign(rate, dto);
    return successResponse(await this.rateRepository.save(rate), 'Shipping rate updated successfully');
  }

  async deleteRate(id: string) {
    const result = await this.rateRepository.softDelete(id);
    if (!result.affected) throw new NotFoundException('Shipping rate not found');
    return emptyReponse('Shipping rate deleted successfully');
  }
}
