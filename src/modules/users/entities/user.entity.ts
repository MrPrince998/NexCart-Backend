import { Role } from '@/modules/roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ nullable: true })
  image!: string;

  @Column()
  roleId!: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column({
    type: 'enum',
    enum: ['active', 'blocked', 'suspended'],
    default: 'active',
  })
  status!: 'active' | 'blocked' | 'suspended';

  @Column({ nullable: true, type: 'timestamp' })
  lastLoginAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
