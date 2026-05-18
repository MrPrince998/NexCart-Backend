import { Product } from '@/modules/products/entities/product.entity';
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

@Entity('product_variants')
@Index(['productId'])
@Index(['sku'], { unique: true })
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  productId!: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ unique: true })
  sku!: string;

  @Column()
  name!: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price!: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountPrice!: number | null;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'jsonb', nullable: true })
  options!: Record<string, string> | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
