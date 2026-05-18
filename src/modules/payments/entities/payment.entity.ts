import { PaymentProvider, PaymentStatus } from '@/common/enums';
import { Order } from '@/modules/orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
@Index(['orderId'])
@Index(['status'])
@Index(['providerTransactionId'])
@Index(['checkoutSessionId'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @Column({ type: 'enum', enum: PaymentProvider })
  provider!: PaymentProvider;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column({ default: 'USD' })
  currency!: string;

  @Column({ type: 'varchar', nullable: true })
  providerTransactionId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  checkoutSessionId!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @Column({ type: 'timestamp', nullable: true })
  paidAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
