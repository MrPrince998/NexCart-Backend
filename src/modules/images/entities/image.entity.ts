import { ImageEntity } from '@/common/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('images')
@Index(['entityType', 'entityId'])
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: ImageEntity })
  entityType!: ImageEntity;

  @Column()
  entityId!: string;

  @Column()
  url!: string;

  @Column()
  publicId!: string;

  @Column({ nullable: true })
  altText!: string;

  @Column({ type: 'int', default: 0 })
  position!: number;

  @Column({ default: false })
  isPrimary!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
