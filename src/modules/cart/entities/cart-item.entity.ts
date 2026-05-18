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
import { Cart } from './cart.entity';

@Entity('cart_items')
@Index(['userId'])
@Index(['userId', 'productId', 'variantId'], { unique: true })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ type: 'uuid', nullable: true })
  cartId!: string | null;

  @ManyToOne(() => Cart, (cart) => cart.items, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart!: Cart | null;

  @Column()
  productId!: string;

  @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'uuid', nullable: true })
  variantId!: string | null;

  @ManyToOne(() => ProductVariant, { nullable: true })
  @JoinColumn({ name: 'variantId' })
  variant!: ProductVariant | null;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
