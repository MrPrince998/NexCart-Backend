import { CouponStatus, DiscountType } from '@/common/enums';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CouponRedemption } from './coupon-redemption.entity';

@Entity('coupons')
@Index(['code'], { unique: true })
@Index(['status'])
@Index(['startsAt', 'expiresAt'])
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'enum', enum: DiscountType })
  discountType!: DiscountType;

  @Column('decimal', { precision: 10, scale: 2 })
  discountValue!: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  minimumOrderAmount!: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maximumDiscountAmount!: number | null;

  @Column({ type: 'int', nullable: true })
  usageLimit!: number | null;

  @Column({ type: 'int', default: 0 })
  usedCount!: number;

  @Column({ type: 'int', nullable: true })
  usageLimitPerUser!: number | null;

  @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.ACTIVE })
  status!: CouponStatus;

  @Column({ type: 'timestamp', nullable: true })
  startsAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt!: Date | null;

  @OneToMany(() => CouponRedemption, (redemption) => redemption.coupon)
  redemptions!: CouponRedemption[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
