import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { successResponse } from '@/common/handler/response.helper';
import { Refund } from './entities/refund.entity';
import { ReturnRequest } from './entities/return-request.entity';
import {
  CreateRefundDto,
  CreateReturnRequestDto,
  UpdateRefundStatusDto,
  UpdateReturnStatusDto,
} from './dto/return.dto';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(ReturnRequest)
    private readonly returnRepository: Repository<ReturnRequest>,
    @InjectRepository(Refund)
    private readonly refundRepository: Repository<Refund>,
  ) {}

  async mine(userId: string) {
    return successResponse(
      await this.returnRepository.find({
        where: { userId },
        relations: { order: true, orderItem: true, refund: true },
        order: { createdAt: 'DESC' },
      }),
      'Return requests retrieved successfully',
    );
  }

  async create(userId: string, dto: CreateReturnRequestDto) {
    const request = this.returnRepository.create({ ...dto, userId });
    return successResponse(await this.returnRepository.save(request), 'Return request created successfully', 201);
  }

  async findAll() {
    return successResponse(
      await this.returnRepository.find({
        relations: { order: true, orderItem: true, user: true, refund: true },
        order: { createdAt: 'DESC' },
      }),
      'Return requests retrieved successfully',
    );
  }

  async updateStatus(id: string, dto: UpdateReturnStatusDto) {
    const request = await this.returnRepository.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Return request not found');
    request.status = dto.status;
    return successResponse(await this.returnRepository.save(request), 'Return request updated successfully');
  }

  async createRefund(returnRequestId: string, dto: CreateRefundDto) {
    const request = await this.returnRepository.findOne({ where: { id: returnRequestId } });
    if (!request) throw new NotFoundException('Return request not found');
    const refund = this.refundRepository.create({ ...dto, returnRequestId });
    return successResponse(await this.refundRepository.save(refund), 'Refund created successfully', 201);
  }

  async updateRefund(id: string, dto: UpdateRefundStatusDto) {
    const refund = await this.refundRepository.findOne({ where: { id } });
    if (!refund) throw new NotFoundException('Refund not found');
    refund.status = dto.status;
    return successResponse(await this.refundRepository.save(refund), 'Refund updated successfully');
  }
}
