import { ProductStatus } from '@/common/enums';
import { ProductView } from '@/modules/activity/entities/product-view.entity';
import { Brand } from '@/modules/brands/entities/brand.entity';
import { InventoryItem } from '@/modules/inventory/entities/inventory-item.entity';
import { ProductCategory } from '@/modules/product-category/entities/product-category.entity';
import { ProductAttributeValue } from '@/modules/product-attributes/entities/product-attribute-value.entity';
import { ProductImage } from '@/modules/product-variants/entities/product-image.entity';
import { ProductVariant } from '@/modules/product-variants/entities/product-variant.entity';
import { Review } from '@/modules/reviews/entities/review.entity';
import { Store } from '@/modules/stores/entities/store.entity';
import { ProductTag } from '@/modules/tags/entities/product-tag.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
@Index(['slug'])
@Index(['brand'])
@Index(['categoryId'])
@Index(['status'])
@Index(['createdAt'])
@Index(['isFeatured', 'status'])
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

  @Column({ type: 'uuid', nullable: true })
  brandId!: string | null;

  @ManyToOne(() => Brand, (brand) => brand.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'brandId' })
  brandRef!: Brand | null;

  @Column({ type: 'uuid', nullable: true })
  storeId!: string | null;

  @ManyToOne(() => Store, (store) => store.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'storeId' })
  store!: Store | null;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'jsonb', nullable: true })
  attributes!: Record<string, string | number | boolean> | null;

  @Column({ type: 'jsonb', nullable: true })
  specifications!: Record<string, string> | null;

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

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants!: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product)
  productImages!: ProductImage[];

  @OneToOne(() => InventoryItem, (inventory) => inventory.product)
  inventory!: InventoryItem;

  @OneToMany(() => ProductTag, (productTag) => productTag.product)
  productTags!: ProductTag[];

  @OneToMany(() => Review, (review) => review.product)
  reviews!: Review[];

  @OneToMany(() => ProductAttributeValue, (value) => value.product)
  attributeValues!: ProductAttributeValue[];

  @OneToMany(() => ProductView, (view) => view.product)
  views!: ProductView[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
