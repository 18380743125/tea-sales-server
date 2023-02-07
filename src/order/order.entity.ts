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
import { User } from '../user/user.entity';
import { Goods } from '../goods/goods.entity';
import { Logistic } from '../logistics/logistic.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ type: 'decimal', comment: '价格' })
  price: number;

  @Column({ comment: '数量' })
  count: number;

  @Column({ length: 1, default: '0', comment: '状态' })
  state: string;

  @Column({ length: 60, nullable: true, comment: '退货原因' })
  reason: string;

  @Column({ type: 'timestamp', nullable: true, comment: '订单结束时间' })
  endTime: Date;

  @OneToOne(() => Logistic, (logistic) => logistic.order)
  logistic: Logistic;

  // 关联用户表
  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  // 关联订单表
  @ManyToOne(() => Goods, (goods) => goods.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  goods: Goods;

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateAt: Date;
}
