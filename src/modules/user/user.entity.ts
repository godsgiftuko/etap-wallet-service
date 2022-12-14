import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { E_USER_ROLE } from 'src/core/schemas';
import { PASSWORD_HASH_SALT } from 'src/core/constants';
import { Wallet } from '../wallet/wallet.entity';

@Entity('users')
export class User extends BaseEntity {
  // @PrimaryColumn()
  // @Generated('increment')
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: E_USER_ROLE,
    default: E_USER_ROLE.CUSTOMER,
  })
  role: E_USER_ROLE;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  @JoinColumn({ name: 'user_wallets' })
  wallets: Wallet[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, PASSWORD_HASH_SALT);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
