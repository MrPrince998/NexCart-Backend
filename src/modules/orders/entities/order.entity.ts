import { OrderStatus, PaymentMethod, PaymentStatus } from '@/common/enums';
import { Address } from '@/modules/addresses/entities/address.entity';
import { Coupon } from '@/modules/coupons/entities/coupon.entity';
import { Payment } from '@/modules/payments/entities/payment.entity';
import { Shipment } from '@/modules/shipping/entities/shipment.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status-history.entity';

@Entity('orders')
@Index(['userId'])
@Index(['status'])
@Index(['paymentStatus'])
@Index(['createdAt'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  orderNumber!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH_ON_DELIVERY,
  })
  paymentMethod!: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus!: PaymentStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shippingTotal!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  taxTotal!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountTotal!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column({ type: 'jsonb' })
  shippingAddress!: Record<string, string>;

  @Column({ type: 'uuid', nullable: true })
  shippingAddressId!: string | null;

  @ManyToOne(() => Address, { nullable: true })
  @JoinColumn({ name: 'shippingAddressId' })
  address!: Address | null;

  @Column({ type: 'uuid', nullable: true })
  couponId!: string | null;

  @ManyToOne(() => Coupon, { nullable: true })
  @JoinColumn({ name: 'couponId' })
  coupon!: Coupon | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments!: Payment[];

  @OneToOne(() => Shipment, (shipment) => shipment.order)
  shipment!: Shipment;

  @OneToMany(() => OrderStatusHistory, (history) => history.order)
  statusHistory!: OrderStatusHistory[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
