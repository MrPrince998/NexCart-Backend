import { Product } from '@/modules/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity('product_images')
@Index(['productId'])
@Index(['variantId'])
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  productId!: string;

  @ManyToOne(() => Product, (product) => product.productImages, {
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
  url!: string;

  @Column()
  publicId!: string;

  @Column({ type: 'varchar', nullable: true })
  altText!: string | null;

  @Column({ type: 'int', default: 0 })
  position!: number;

  @Column({ default: false })
  isPrimary!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
