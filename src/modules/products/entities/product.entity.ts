import { ProductStatus } from '@/common/enums';
import { ProductCategory } from '@/modules/product-category/entities/product-category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountPrice!: number | null;

  @Column({ unique: true, length: 50 })
  sku!: string;

  @Column()
  brand!: string;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status!: ProductStatus;

  @Column()
  categoryId!: string;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category!: ProductCategory;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  averageRating!: number | null;

  @Column({ default: 0 })
  reviewCount!: number;

  @Column({ default: 0 })
  salesCount!: number;

  @Column({ default: 0 })
  viewCount!: number;

  @Column({ default: false })
  isFeatured!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
