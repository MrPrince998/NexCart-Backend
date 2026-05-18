import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RefundStatusChangedEvent,
  ReturnStatusChangedEvent,
} from '@/common/events';
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
    private readonly eventEmitter: EventEmitter2,
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
    const savedRequest = await this.returnRepository.save(request);
    const event = await this.buildReturnStatusEvent(savedRequest.id);
    if (event) this.eventEmitter.emit('return.status.changed', event);

    return successResponse(
      savedRequest,
      'Return request created successfully',
      201,
    );
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
    const savedRequest = await this.returnRepository.save(request);
    const event = await this.buildReturnStatusEvent(savedRequest.id);
    if (event) this.eventEmitter.emit('return.status.changed', event);

    return successResponse(savedRequest, 'Return request updated successfully');
  }

  async createRefund(returnRequestId: string, dto: CreateRefundDto) {
    const request = await this.returnRepository.findOne({
      where: { id: returnRequestId },
    });
    if (!request) throw new NotFoundException('Return request not found');
    const refund = this.refundRepository.create({ ...dto, returnRequestId });
    const savedRefund = await this.refundRepository.save(refund);
    const event = await this.buildRefundStatusEvent(savedRefund.id);
    if (event) this.eventEmitter.emit('refund.status.changed', event);

    return successResponse(savedRefund, 'Refund created successfully', 201);
  }

  async updateRefund(id: string, dto: UpdateRefundStatusDto) {
    const refund = await this.refundRepository.findOne({ where: { id } });
    if (!refund) throw new NotFoundException('Refund not found');
    refund.status = dto.status;
    const savedRefund = await this.refundRepository.save(refund);
    const event = await this.buildRefundStatusEvent(savedRefund.id);
    if (event) this.eventEmitter.emit('refund.status.changed', event);

    return successResponse(savedRefund, 'Refund updated successfully');
  }

  private async buildReturnStatusEvent(id: string) {
    const request = await this.returnRepository.findOne({
      where: { id },
      relations: { order: true, user: true },
    });
    if (!request) return null;

    return new ReturnStatusChangedEvent(
      request.id,
      request.order.orderNumber,
      request.user.email,
      request.user.name,
      request.status,
      request.reason,
    );
  }

  private async buildRefundStatusEvent(id: string) {
    const refund = await this.refundRepository.findOne({
      where: { id },
      relations: {
        returnRequest: { order: true, user: true },
      },
    });
    if (!refund) return null;

    return new RefundStatusChangedEvent(
      refund.id,
      refund.returnRequest.order.orderNumber,
      refund.returnRequest.user.email,
      refund.returnRequest.user.name,
      refund.status,
      Number(refund.amount),
      refund.currency,
    );
  }
}
