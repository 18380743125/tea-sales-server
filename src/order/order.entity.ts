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
import { Expose } from "class-transformer";

@Entity()
export class Order {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ type: 'decimal', comment: '价格' })
  @Expose()
  price: number;

  @Column({ comment: '数量' })
  @Expose()
  count: number;

  @Column({ length: 1, default: '0', comment: '状态' })
  @Expose()
  state: string;

  @Column({ length: 60, nullable: true, comment: '退货原因' })
  @Expose()
  reason: string;

  @Column({ type: 'timestamp', nullable: true, comment: '订单结束时间' })
  @Expose()
  endTime: Date;

  @OneToOne(() => Logistic, (logistic) => logistic.order)
  @Expose()
  logistic: Logistic;

  // 关联用户表
  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  user: User;

  // 关联订单表
  @ManyToOne(() => Goods, (goods) => goods.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  goods: Goods;

  @CreateDateColumn({ comment: '创建时间' })
  @Expose()
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Expose()
  updateAt: Date;
}
