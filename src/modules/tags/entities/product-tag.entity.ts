import { Product } from '@/modules/products/entities/product.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity('product_tags')
@Index(['productId', 'tagId'], { unique: true })
export class ProductTag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  productId!: string;

  @ManyToOne(() => Product, (product) => product.productTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column()
  tagId!: string;

  @ManyToOne(() => Tag, (tag) => tag.productTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tagId' })
  tag!: Tag;
}
