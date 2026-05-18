import { StoreStatus } from '@/common/enums';
import { StoreStatusChangedEvent } from '@/common/events';
import {
  emptyReponse,
  successResponse,
} from '@/common/handler/response.helper';
import { generateSlug } from '@/common/utils/generate-slug.util';
import { Product } from '@/modules/products/entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(ownerId: string, dto: CreateStoreDto) {
    const store = this.storeRepository.create({
      ...dto,
      ownerId,
      slug: await generateSlug(dto.name, this.storeRepository),
      description: dto.description ?? null,
      logoUrl: dto.logoUrl ?? null,
      supportEmail: dto.supportEmail ?? null,
      supportPhone: dto.supportPhone ?? null,
      status: StoreStatus.PENDING,
    });
    const savedStore = await this.storeRepository.save(store);
    await this.emitStoreStatusChanged(savedStore.id);

    return successResponse(savedStore, 'Store created successfully', 201);
  }

  async mine(ownerId: string) {
    return successResponse(
      await this.storeRepository.find({
        where: { ownerId },
        relations: { products: true },
      }),
      'Stores retrieved successfully',
    );
  }

  async findAll() {
    return successResponse(
      await this.storeRepository.find({
        relations: { owner: true },
        order: { createdAt: 'DESC' },
      }),
      'Stores retrieved successfully',
    );
  }

  async findOne(idOrSlug: string) {
    const store = await this.storeRepository.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
      relations: { owner: true, products: true },
    });
    if (!store) throw new NotFoundException('Store not found');
    return successResponse(store, 'Store retrieved successfully');
  }

  async update(id: string, dto: UpdateStoreDto) {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');
    const oldStatus = store.status;
    if (dto.name && dto.name !== store.name) {
      store.slug = await generateSlug(dto.name, this.storeRepository);
    }
    Object.assign(store, dto);
    const savedStore = await this.storeRepository.save(store);

    if (oldStatus !== savedStore.status) {
      await this.emitStoreStatusChanged(savedStore.id);
    }

    return successResponse(savedStore, 'Store updated successfully');
  }

  async dashboard(ownerId: string) {
    const stores = await this.storeRepository.find({ where: { ownerId } });
    const storeIds = stores.map((store) => store.id);
    const productCount = storeIds.length
      ? await this.productRepository.count({
          where: storeIds.map((storeId) => ({ storeId })),
        })
      : 0;

    return successResponse(
      {
        stores,
        totals: {
          stores: stores.length,
          products: productCount,
        },
      },
      'Seller dashboard retrieved successfully',
    );
  }

  async remove(id: string) {
    const result = await this.storeRepository.softDelete(id);
    if (!result.affected) throw new NotFoundException('Store not found');
    return emptyReponse('Store deleted successfully');
  }

  private async emitStoreStatusChanged(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!store) return;

    this.eventEmitter.emit(
      'store.status.changed',
      new StoreStatusChangedEvent(
        store.id,
        store.name,
        store.status,
        store.owner.email,
        store.owner.name,
      ),
    );
  }
}
