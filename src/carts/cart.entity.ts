import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Goods } from '../goods/goods.entity';
import { Expose } from "class-transformer";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ comment: '单价' })
  @Expose()
  price: number;

  @Column({ comment: '数量' })
  @Expose()
  count: number;

  // 关联用户表
  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  user: User;

  // 关联商品表
  @ManyToMany(() => Goods, (goods) => goods.carts)
  @JoinTable({ name: 'carts_goods' })
  @Expose()
  goods: Goods[];
}
