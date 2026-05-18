import { ShipmentStatus } from '@/common/enums';
import { Order } from '@/modules/orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('shipments')
@Index(['orderId'], { unique: true })
@Index(['status'])
@Index(['trackingNumber'])
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  orderId!: string;

  @OneToOne(() => Order, (order) => order.shipment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @Column({ type: 'varchar', nullable: true })
  carrier!: string | null;

  @Column({ type: 'varchar', nullable: true })
  trackingNumber!: string | null;

  @Column({ type: 'enum', enum: ShipmentStatus, default: ShipmentStatus.PENDING })
  status!: ShipmentStatus;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
