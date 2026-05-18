import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShippingZone } from './shipping-zone.entity';

@Entity('shipping_rates')
@Index(['zoneId'])
@Index(['isActive'])
export class ShippingRate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  zoneId!: string;

  @ManyToOne(() => ShippingZone, (zone) => zone.rates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'zoneId' })
  zone!: ShippingZone;

  @Column()
  name!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ default: 'USD' })
  currency!: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  minOrderAmount!: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxOrderAmount!: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  minWeight!: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxWeight!: number | null;

  @Column({ type: 'int', nullable: true })
  estimatedDaysMin!: number | null;

  @Column({ type: 'int', nullable: true })
  estimatedDaysMax!: number | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
