import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentStatus } from '@/common/enums';
import { successResponse } from '@/common/handler/response.helper';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto, UpdateShipmentDto } from './dto/shipment.dto';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
  ) {}

  async findAll() {
    return successResponse(
      await this.shipmentRepository.find({ relations: { order: true }, order: { createdAt: 'DESC' } }),
      'Shipments retrieved successfully',
    );
  }

  async create(dto: CreateShipmentDto) {
    const shipment = this.shipmentRepository.create({
      ...dto,
      carrier: dto.carrier ?? null,
      trackingNumber: dto.trackingNumber ?? null,
    });
    return successResponse(await this.shipmentRepository.save(shipment), 'Shipment created successfully', 201);
  }

  async update(id: string, dto: UpdateShipmentDto) {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });
    if (!shipment) throw new NotFoundException('Shipment not found');
    Object.assign(shipment, dto);
    if (dto.status === ShipmentStatus.IN_TRANSIT && !shipment.shippedAt) shipment.shippedAt = new Date();
    if (dto.status === ShipmentStatus.DELIVERED && !shipment.deliveredAt) shipment.deliveredAt = new Date();
    return successResponse(await this.shipmentRepository.save(shipment), 'Shipment updated successfully');
  }
}
