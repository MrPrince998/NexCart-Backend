import { ReturnStatus } from '@/common/enums';
import { OrderItem } from '@/modules/orders/entities/order-item.entity';
import { Order } from '@/modules/orders/entities/order.entity';
import { User } from '@/modules/users/entities/user.entity';
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
import { Refund } from './refund.entity';

@Entity('return_requests')
@Index(['orderId'])
@Index(['userId'])
@Index(['status'])
export class ReturnRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  orderId!: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @Column()
  orderItemId!: string;

  @ManyToOne(() => OrderItem)
  @JoinColumn({ name: 'orderItemId' })
  orderItem!: OrderItem;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'text' })
  reason!: string;

  @Column({ type: 'enum', enum: ReturnStatus, default: ReturnStatus.REQUESTED })
  status!: ReturnStatus;

  @OneToOne(() => Refund, (refund) => refund.returnRequest)
  refund!: Refund;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
