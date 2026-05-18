import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('verifications')
@Index(['identifier'])
@Index(['expiresAt'])
export class AuthVerification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  identifier!: string;

  @Column()
  value!: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
