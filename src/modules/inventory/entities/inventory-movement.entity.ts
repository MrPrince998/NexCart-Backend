import { InventoryMovementType } from '@/common/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

@Entity('inventory_movements')
@Index(['inventoryItemId'])
@Index(['type'])
@Index(['createdAt'])
export class InventoryMovement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  inventoryItemId!: string;

  @ManyToOne(() => InventoryItem, (item) => item.movements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inventoryItemId' })
  inventoryItem!: InventoryItem;

  @Column({ type: 'enum', enum: InventoryMovementType })
  type!: InventoryMovementType;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'varchar', nullable: true })
  referenceType!: string | null;

  @Column({ type: 'uuid', nullable: true })
  referenceId!: string | null;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
