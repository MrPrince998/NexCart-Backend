import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('addresses')
@Index(['userId'])
@Index(['userId', 'isDefault'])
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  fullName!: string;

  @Column()
  phone!: string;

  @Column()
  line1!: string;

  @Column({ type: 'varchar', nullable: true })
  line2!: string | null;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  postalCode!: string;

  @Column({ default: 'US' })
  country!: string;

  @Column({ default: false })
  isDefault!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
