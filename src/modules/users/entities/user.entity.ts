import { Address } from '@/modules/addresses/entities/address.entity';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { Order } from '@/modules/orders/entities/order.entity';
import { Review } from '@/modules/reviews/entities/review.entity';
import { Role } from '@/modules/roles/entities/role.entity';
import { Wishlist } from '@/modules/wishlist/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Index(['email'])
@Index(['roleId'])
@Index(['status'])
@Index(['createdAt'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'varchar', nullable: true })
  image!: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

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
  lastLoginAt!: Date | null;

  @OneToMany(() => Address, (address) => address.user)
  addresses!: Address[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart!: Cart;

  @OneToOne(() => Wishlist, (wishlist) => wishlist.user)
  wishlist!: Wishlist;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
