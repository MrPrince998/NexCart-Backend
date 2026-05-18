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
import { Wishlist } from './wishlist.entity';

@Entity('wishlist_items')
@Index(['userId'])
@Index(['userId', 'productId'], { unique: true })
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ type: 'uuid', nullable: true })
  wishlistId!: string | null;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wishlistId' })
  wishlist!: Wishlist | null;

  @Column()
  productId!: string;

  @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date;
}
