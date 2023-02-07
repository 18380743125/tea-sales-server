import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Goods } from '../goods/goods.entity';
import { Order } from '../order/order.entity';

@Entity()
export class Logistic {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '运输公司名称' })
  way: string;

  @Column({ length: 1, comment: '运输状态' })
  state: string;

  @Column({ type: 'timestamp', nullable: true, comment: '确认收货时间' })
  endTime: Date;

  // 关联订单表
  @OneToOne(() => Order, (order) => order.logistic, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: Order;

  // 关联用户表
  @ManyToOne(() => User, (user) => user.logistic, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  // 关联商品表
  @ManyToOne(() => Goods, (goods) => goods.logistic, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  goods: Goods;

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateAt: Date;
}
