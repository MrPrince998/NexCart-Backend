import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sessions')
@Index(['userId'])
@Index(['token'], { unique: true })
@Index(['expiresAt'])
export class AuthSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  token!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  ipAddress!: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
