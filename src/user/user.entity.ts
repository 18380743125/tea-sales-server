import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Avatar } from './avatar.entity';
import { Address } from '../address/address.entity';
import { Cart } from '../carts/cart.entity';
import { Order } from '../order/order.entity';
import { Logistic } from '../logistics/logistic.entity';
import { EvaluateChat } from '../evaluate/evaluate-chat.entity';
import { Evaluate } from '../evaluate/evaluate.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ unique: true, length: 32, comment: '用户名' })
  name: string;

  @Column({ length: 128, comment: '密码' })
  password: string;

  @Column({ length: 1, default: '女', comment: '性别' })
  gender: string;

  @Column({ default: 1, comment: '年龄' })
  age: number;

  @Column({ nullable: true, length: 20, comment: '联系电话' })
  phone: string;

  @Column({ length: 1, default: '0', comment: '是否禁用' })
  banned: string;

  @OneToOne(() => Avatar, (avatar) => avatar.user, {
    cascade: ['insert'],
  })
  avatar: Avatar;

  @OneToMany(() => Cart, (cart) => cart.user, {
    cascade: ['insert'],
  })
  carts: Cart[];

  @OneToMany(() => Address, (address) => address.user, {
    cascade: ['insert'],
  })
  addresses: Address[];

  @OneToMany(() => Logistic, (logistic) => logistic.user)
  logistic: Logistic[];

  @OneToMany(() => Order, (order) => order.user, {
    cascade: ['insert'],
  })
  orders: Order[];

  @OneToMany(() => Evaluate, (evaluate) => evaluate.evaluate)
  evaluate: Evaluate[];

  @OneToMany(() => EvaluateChat, (chat) => chat.user)
  evaluateChat: EvaluateChat[];

  // 关联角色表
  @ManyToMany(() => Role, (role) => role.users, {
    cascade: ['insert'],
  })
  @JoinTable({ name: 'user_role' })
  roles: Role[];

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateAt: Date;
}
