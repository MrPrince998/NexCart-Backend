import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductTag } from './product-tag.entity';

@Entity('tags')
@Index(['slug'], { unique: true })
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @OneToMany(() => ProductTag, (productTag) => productTag.tag)
  productTags!: ProductTag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
