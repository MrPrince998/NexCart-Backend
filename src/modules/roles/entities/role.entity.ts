import { User } from '@/modules/users/entities/user.entity';
import { Permission } from '@/common/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: 'customer' | 'admin' | 'vendor' | 'super_admin';

  @Column()
  description!: string;

  @Column({ default: false })
  isSystem!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  permissions!: Permission[] | null;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'parentRoleId' })
  parentRole!: Role;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
