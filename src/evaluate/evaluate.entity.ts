import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Goods } from '../goods/goods.entity';
import { EvaluateImg } from './evaluate-img.entity';
import { EvaluateChat } from './evaluate-chat.entity';
import { User } from '../user/user.entity';

@Entity()
export class Evaluate {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '评价等级' })
  star: number;

  @Column({ length: 150, comment: '评价文本' })
  content: string;

  @OneToMany(() => EvaluateImg, (evaluateImg) => evaluateImg.evaluate, {
    cascade: ['insert'],
  })
  imgs: EvaluateImg[];

  @OneToMany(() => EvaluateChat, (chat) => chat.evaluate)
  chats: EvaluateChat[];

  // 关联用户表
  @ManyToOne(() => User, (user) => user.evaluate, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  evaluate: Evaluate;

  // 关联商品表
  @ManyToOne(() => Goods, (goods) => goods.evaluate, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  goods: Goods;
}
