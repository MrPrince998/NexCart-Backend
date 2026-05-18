import { Product } from '@/modules/products/entities/product.entity';
import { ProductVariant } from '@/modules/product-variants/entities/product-variant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InventoryMovement } from './inventory-movement.entity';

@Entity('inventory_items')
@Index(['productId'])
@Index(['variantId'])
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  productId!: string;

  @OneToOne(() => Product, (product) => product.inventory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'uuid', nullable: true })
  variantId!: string | null;

  @OneToOne(() => ProductVariant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variantId' })
  variant!: ProductVariant | null;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column({ type: 'int', default: 0 })
  reservedQuantity!: number;

  @Column({ type: 'int', default: 0 })
  lowStockThreshold!: number;

  @OneToMany(() => InventoryMovement, (movement) => movement.inventoryItem)
  movements!: InventoryMovement[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
