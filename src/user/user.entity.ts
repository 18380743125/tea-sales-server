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
import { Exclude, Expose } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ unique: true, length: 32, comment: '用户名' })
  @Expose()
  name: string;

  @Column({ length: 128, comment: '密码' })
  @Exclude()
  password: string;

  @Column({ length: 1, default: '0', comment: '性别' })
  @Expose()
  gender: string;

  @Column({ default: 1, comment: '年龄' })
  @Expose()
  age: number;

  @Column({ nullable: true, length: 20, comment: '联系电话' })
  @Expose()
  phone: string;

  @Column({ length: 1, default: '0', comment: '是否禁用' })
  @Expose()
  banned: string;

  @OneToOne(() => Avatar, (avatar) => avatar.user, {
    cascade: ['insert'],
  })
  @Expose()
  avatar: Avatar;

  @OneToMany(() => Cart, (cart) => cart.user, {
    cascade: ['insert'],
  })
  @Expose()
  carts: Cart[];

  @OneToMany(() => Address, (address) => address.user, {
    cascade: ['insert'],
  })
  @Expose()
  addresses: Address[];

  @OneToMany(() => Logistic, (logistic) => logistic.user)
  @Expose()
  logistic: Logistic[];

  @OneToMany(() => Order, (order) => order.user, {
    cascade: ['insert'],
  })
  @Expose()
  orders: Order[];

  @OneToMany(() => Evaluate, (evaluate) => evaluate.user)
  @Expose()
  evaluate: Evaluate[];

  @OneToMany(() => EvaluateChat, (chat) => chat.user)
  @Expose()
  evaluateChat: EvaluateChat[];

  // 关联角色表
  @ManyToMany(() => Role, (role) => role.users, {
    cascade: ['insert'],
  })
  @JoinTable({ name: 'user_role' })
  @Expose()
  roles: Role[];

  @CreateDateColumn({ comment: '创建时间' })
  @Expose()
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Expose()
  updateAt: Date;
}
