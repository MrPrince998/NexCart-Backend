import { Coupon } from '@/modules/coupons/entities/coupon.entity';
import { Order } from '@/modules/orders/entities/order.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('coupon_redemptions')
@Index(['couponId'])
@Index(['userId'])
@Index(['orderId'], { unique: true })
@Index(['couponId', 'userId'])
export class CouponRedemption {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  couponId!: string;

  @ManyToOne(() => Coupon, (coupon) => coupon.redemptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'couponId' })
  coupon!: Coupon;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  orderId!: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @Column('decimal', { precision: 10, scale: 2 })
  discountAmount!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
