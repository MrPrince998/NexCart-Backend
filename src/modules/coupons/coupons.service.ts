import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponPromoEvent } from '@/common/events';
import {
  emptyReponse,
  successResponse,
} from '@/common/handler/response.helper';
import { User } from '@/modules/users/entities/user.entity';
import { Coupon } from './entities/coupon.entity';
import { CouponRedemption } from './entities/coupon-redemption.entity';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(CouponRedemption)
    private readonly redemptionRepository: Repository<CouponRedemption>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll() {
    return successResponse(
      await this.couponRepository.find({ order: { createdAt: 'DESC' } }),
      'Coupons retrieved successfully',
    );
  }

  async findOne(id: string) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return successResponse(coupon, 'Coupon retrieved successfully');
  }

  async create(dto: CreateCouponDto) {
    const coupon = this.couponRepository.create({
      ...dto,
      code: dto.code.toUpperCase(),
      description: dto.description ?? null,
      minimumOrderAmount: dto.minimumOrderAmount ?? null,
      maximumDiscountAmount: dto.maximumDiscountAmount ?? null,
      usageLimit: dto.usageLimit ?? null,
      usageLimitPerUser: dto.usageLimitPerUser ?? null,
    });
    const savedCoupon = await this.couponRepository.save(coupon);
    await this.emitCouponPromo(savedCoupon);

    return successResponse(savedCoupon, 'Coupon created successfully', 201);
  }

  async update(id: string, dto: UpdateCouponDto) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    Object.assign(coupon, {
      ...dto,
      code: dto.code?.toUpperCase() ?? coupon.code,
    });
    const savedCoupon = await this.couponRepository.save(coupon);
    await this.emitCouponPromo(savedCoupon);

    return successResponse(savedCoupon, 'Coupon updated successfully');
  }

  async remove(id: string) {
    const result = await this.couponRepository.softDelete(id);
    if (!result.affected) throw new NotFoundException('Coupon not found');
    return emptyReponse('Coupon deleted successfully');
  }

  async redemptions(couponId?: string) {
    return successResponse(
      await this.redemptionRepository.find({
        where: couponId ? { couponId } : {},
        relations: { coupon: true, user: true, order: true },
        order: { createdAt: 'DESC' },
      }),
      'Coupon redemptions retrieved successfully',
    );
  }

  private async emitCouponPromo(coupon: Coupon) {
    const users = await this.userRepository.find({
      where: {
        emailNotificationsEnabled: true,
        marketingEmailNotificationsEnabled: true,
      },
    });

    for (const user of users) {
      this.eventEmitter.emit(
        'coupon.promo',
        new CouponPromoEvent(
          coupon.code,
          coupon.name,
          coupon.description,
          user.email,
          user.name,
        ),
      );
    }
  }
}
