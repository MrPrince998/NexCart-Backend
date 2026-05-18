import { Product } from '@/modules/products/entities/product.entity';
import { ProductVariant } from '@/modules/product-variants/entities/product-variant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';

@Entity('product_attribute_values')
@Index(['productId'])
@Index(['variantId'])
@Index(['attributeId'])
@Index(['productId', 'attributeId', 'variantId'], { unique: true })
export class ProductAttributeValue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  productId!: string;

  @ManyToOne(() => Product, (product) => product.attributeValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'uuid', nullable: true })
  variantId!: string | null;

  @ManyToOne(() => ProductVariant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variantId' })
  variant!: ProductVariant | null;

  @Column()
  attributeId!: string;

  @ManyToOne(() => ProductAttribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attributeId' })
  attribute!: ProductAttribute;

  @Column({ type: 'text' })
  value!: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
  numericValue!: number | null;

  @Column({ type: 'boolean', nullable: true })
  booleanValue!: boolean | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
