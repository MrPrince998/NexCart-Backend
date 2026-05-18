import { StoreStatus } from '@/common/enums';
import { Product } from '@/modules/products/entities/product.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stores')
@Index(['ownerId'])
@Index(['slug'], { unique: true })
@Index(['status'])
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  ownerId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', nullable: true })
  logoUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  supportEmail!: string | null;

  @Column({ type: 'varchar', nullable: true })
  supportPhone!: string | null;

  @Column({ type: 'enum', enum: StoreStatus, default: StoreStatus.PENDING })
  status!: StoreStatus;

  @OneToMany(() => Product, (product) => product.store)
  products!: Product[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
