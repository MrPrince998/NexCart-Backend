import { ProductAttributeType } from '@/common/enums';
import { ProductCategory } from '@/modules/product-category/entities/product-category.entity';
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
import { ProductAttributeValue } from './product-attribute-value.entity';

@Entity('product_attributes')
@Index(['slug'], { unique: true })
@Index(['categoryId'])
@Index(['isFilterable'])
export class ProductAttribute {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'enum', enum: ProductAttributeType })
  type!: ProductAttributeType;

  @Column({ type: 'uuid', nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => ProductCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category!: ProductCategory | null;

  @Column({ type: 'jsonb', nullable: true })
  options!: string[] | null;

  @Column({ default: false })
  isRequired!: boolean;

  @Column({ default: true })
  isFilterable!: boolean;

  @Column({ default: true })
  isComparable!: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @OneToMany(() => ProductAttributeValue, (value) => value.attribute)
  values!: ProductAttributeValue[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
