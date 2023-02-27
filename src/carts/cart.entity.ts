import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Goods } from '../goods/goods.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ comment: '数量' })
  @Expose()
  count: number;

  @Column({ default: true, comment: '是否被选中' })
  @Expose()
  checked: boolean;

  // 关联用户表
  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  user: User;

  // 关联商品表
  @ManyToOne(() => Goods, (goods) => goods.carts)
  @JoinColumn()
  @Expose()
  goods: Goods;
}
