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
import { ShippingRate } from './shipping-rate.entity';

@Entity('shipping_zones')
@Index(['name'], { unique: true })
@Index(['isActive'])
export class ShippingZone {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'jsonb' })
  countries!: string[];

  @Column({ type: 'jsonb', nullable: true })
  states!: string[] | null;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => ShippingRate, (rate) => rate.zone)
  rates!: ShippingRate[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
