import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { emptyReponse, successResponse } from '@/common/handler/response.helper';
import { Address } from './entities/address.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async findMine(userId: string) {
    const addresses = await this.addressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
    return successResponse(addresses, 'Addresses retrieved successfully');
  }

  async create(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) await this.clearDefault(userId);
    const address = await this.addressRepository.save(
      this.addressRepository.create({ ...dto, userId, line2: dto.line2 ?? null }),
    );
    return successResponse(address, 'Address created successfully', 201);
  }

  async update(userId: string, id: string, dto: UpdateAddressDto) {
    const address = await this.addressRepository.findOne({ where: { id, userId } });
    if (!address) throw new NotFoundException('Address not found');
    if (dto.isDefault) await this.clearDefault(userId);
    Object.assign(address, { ...dto, line2: dto.line2 ?? address.line2 });
    return successResponse(
      await this.addressRepository.save(address),
      'Address updated successfully',
    );
  }

  async setDefault(userId: string, id: string) {
    const address = await this.addressRepository.findOne({ where: { id, userId } });
    if (!address) throw new NotFoundException('Address not found');
    await this.clearDefault(userId);
    address.isDefault = true;
    return successResponse(
      await this.addressRepository.save(address),
      'Default address updated successfully',
    );
  }

  async remove(userId: string, id: string) {
    const result = await this.addressRepository.softDelete({ id, userId });
    if (!result.affected) throw new NotFoundException('Address not found');
    return emptyReponse('Address deleted successfully');
  }

  private async clearDefault(userId: string) {
    await this.addressRepository.update({ userId, isDefault: true }, { isDefault: false });
  }
}
