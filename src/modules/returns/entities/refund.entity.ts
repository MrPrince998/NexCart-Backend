import { RefundStatus } from '@/common/enums';
import { Payment } from '@/modules/payments/entities/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReturnRequest } from './return-request.entity';

@Entity('refunds')
@Index(['paymentId'])
@Index(['status'])
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  returnRequestId!: string;

  @OneToOne(() => ReturnRequest, (returnRequest) => returnRequest.refund)
  @JoinColumn({ name: 'returnRequestId' })
  returnRequest!: ReturnRequest;

  @Column()
  paymentId!: string;

  @ManyToOne(() => Payment)
  @JoinColumn({ name: 'paymentId' })
  payment!: Payment;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column({ default: 'USD' })
  currency!: string;

  @Column({ type: 'enum', enum: RefundStatus, default: RefundStatus.PENDING })
  status!: RefundStatus;

  @Column({ type: 'varchar', nullable: true })
  providerRefundId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
