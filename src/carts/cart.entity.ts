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

@Entity()
export class Cart {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '单价' })
  price: number;

  @Column({ comment: '数量' })
  count: number;

  // 关联用户表
  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  // 关联商品表
  @ManyToMany(() => Goods, (goods) => goods.carts)
  @JoinTable({ name: 'carts_goods' })
  goods: Goods[];
}
