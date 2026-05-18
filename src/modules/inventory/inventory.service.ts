import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { InventoryMovementType } from '@/common/enums';
import { successResponse } from '@/common/handler/response.helper';
import { InventoryItem } from './entities/inventory-item.entity';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { CreateInventoryMovementDto, UpdateInventoryDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(InventoryMovement)
    private readonly movementRepository: Repository<InventoryMovement>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return successResponse(
      await this.inventoryRepository.find({
        relations: { product: true, variant: true },
        order: { updatedAt: 'DESC' },
      }),
      'Inventory retrieved successfully',
    );
  }

  async update(id: string, dto: UpdateInventoryDto) {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    item.quantity = dto.quantity;
    item.lowStockThreshold = dto.lowStockThreshold ?? item.lowStockThreshold;
    return successResponse(await this.inventoryRepository.save(item), 'Inventory updated successfully');
  }

  async addMovement(id: string, dto: CreateInventoryMovementDto) {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');

    const result = await this.dataSource.transaction(async (manager) => {
      this.applyMovement(item, dto.type, dto.quantity);
      const savedItem = await manager.save(InventoryItem, item);
      const movement = await manager.save(
        InventoryMovement,
        manager.create(InventoryMovement, {
          inventoryItemId: id,
          type: dto.type,
          quantity: this.toSignedMovementQuantity(dto.type, dto.quantity),
          referenceType: dto.referenceType ?? null,
          referenceId: dto.referenceId ?? null,
          note: dto.note ?? null,
        }),
      );
      return { item: savedItem, movement };
    });

    return successResponse(result, 'Inventory movement recorded successfully');
  }

  async movements(id: string) {
    return successResponse(
      await this.movementRepository.find({
        where: { inventoryItemId: id },
        order: { createdAt: 'DESC' },
      }),
      'Inventory movements retrieved successfully',
    );
  }

  private applyMovement(
    item: InventoryItem,
    type: InventoryMovementType,
    quantity: number,
  ) {
    switch (type) {
      case InventoryMovementType.STOCK_IN:
        item.quantity += quantity;
        return;
      case InventoryMovementType.STOCK_OUT:
        if (item.quantity - item.reservedQuantity < quantity) {
          throw new BadRequestException('Insufficient available inventory');
        }
        item.quantity -= quantity;
        return;
      case InventoryMovementType.ADJUSTMENT:
        if (quantity < item.reservedQuantity) {
          throw new BadRequestException(
            'Adjusted quantity cannot be lower than reserved quantity',
          );
        }
        item.quantity = quantity;
        return;
      case InventoryMovementType.RESERVATION:
        if (item.quantity - item.reservedQuantity < quantity) {
          throw new BadRequestException('Insufficient available inventory');
        }
        item.reservedQuantity += quantity;
        return;
      case InventoryMovementType.RELEASE:
        item.reservedQuantity = Math.max(0, item.reservedQuantity - quantity);
        return;
      default:
        throw new BadRequestException('Unsupported inventory movement');
    }
  }

  private toSignedMovementQuantity(
    type: InventoryMovementType,
    quantity: number,
  ) {
    return [
      InventoryMovementType.STOCK_OUT,
      InventoryMovementType.RELEASE,
    ].includes(type)
      ? -quantity
      : quantity;
  }
}
