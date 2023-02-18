import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Goods } from '../goods/goods.entity';
import { EvaluateImg } from './evaluate-img.entity';
import { EvaluateChat } from './evaluate-chat.entity';
import { User } from '../user/user.entity';
import { Expose } from 'class-transformer';
import { Order } from '../order/order.entity';

@Entity()
export class Evaluate {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ type: 'float', comment: '评价等级' })
  @Expose()
  star: number;

  @Column({ length: 300, comment: '评价文本' })
  @Expose()
  content: string;

  @OneToMany(() => EvaluateImg, (evaluateImg) => evaluateImg.evaluate, {
    cascade: ['insert'],
  })
  @Expose()
  imgs: EvaluateImg[];

  @OneToMany(() => EvaluateChat, (chat) => chat.evaluate)
  @Expose()
  chats: EvaluateChat[];

  // 关联用户表
  @ManyToOne(() => User, (user) => user.evaluate, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  user: User;

  // 关联订单表
  @OneToOne(() => Order, (order) => order.evaluate, {
    onDelete: 'CASCADE',
  })
  @Expose()
  @JoinColumn()
  order: Order;

  @CreateDateColumn({ comment: '创建时间' })
  @Expose()
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Expose()
  updateAt: Date;
}
