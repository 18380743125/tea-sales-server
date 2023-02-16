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
import { Expose } from "class-transformer";

@Entity()
export class Logistic {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ comment: '运输公司名称' })
  @Expose()
  way: string;

  @Column({ length: 1, comment: '运输状态' })
  @Expose()
  state: string;

  @Column({ type: 'timestamp', nullable: true, comment: '送达时间' })
  @Expose()
  endTime: Date;

  // 关联订单表
  @OneToOne(() => Order, (order) => order.logistic, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  order: Order;

  // 关联用户表
  @ManyToOne(() => User, (user) => user.logistic, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  user: User;

  @CreateDateColumn({ comment: '创建时间' })
  @Expose()
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Expose()
  updateAt: Date;
}
