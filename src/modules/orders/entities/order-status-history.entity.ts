import { OrderStatus } from '@/common/enums';
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
import { Order } from './order.entity';

@Entity('order_status_history')
@Index(['orderId'])
@Index(['changedByUserId'])
@Index(['createdAt'])
export class OrderStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.statusHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @Column({ type: 'enum', enum: OrderStatus, nullable: true })
  fromStatus!: OrderStatus | null;

  @Column({ type: 'enum', enum: OrderStatus })
  toStatus!: OrderStatus;

  @Column({ type: 'uuid', nullable: true })
  changedByUserId!: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'changedByUserId' })
  changedBy!: User | null;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
