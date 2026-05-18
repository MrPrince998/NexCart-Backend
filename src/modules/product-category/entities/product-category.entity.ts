import { Product } from '@/modules/products/entities/product.entity';
import { ProductAttribute } from '@/modules/product-attributes/entities/product-attribute.entity';
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

@Entity('product_categories')
@Index(['slug'])
@Index(['parentCategoryId'])
@Index(['isActive'])
@Index(['createdAt'])
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', nullable: true })
  image!: string | null;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ type: 'uuid', nullable: true })
  parentCategoryId!: string | null;

  @ManyToOne(() => ProductCategory, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentCategoryId' })
  parent!: ProductCategory | null;

  @OneToMany(() => ProductCategory, (category) => category.parent)
  children!: ProductCategory[];

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];

  @OneToMany(() => ProductAttribute, (attribute) => attribute.category)
  attributes!: ProductAttribute[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
