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

@Entity('accounts')
@Index(['userId'])
@Index(['providerId', 'accountId'], { unique: true })
export class AuthAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  accountId!: string;

  @Column()
  providerId!: string;

  @Column({ type: 'text', nullable: true })
  accessToken!: string | null;

  @Column({ type: 'text', nullable: true })
  refreshToken!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  accessTokenExpiresAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  refreshTokenExpiresAt!: Date | null;

  @Column({ type: 'varchar', nullable: true })
  scope!: string | null;

  @Column({ type: 'text', nullable: true })
  idToken!: string | null;

  @Column({ type: 'text', nullable: true })
  password!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
