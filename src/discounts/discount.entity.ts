import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Goods } from '../goods/goods.entity';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ type: 'float', comment: '折扣率' })
  rate: number;

  @Column({ nullable: true, length: 20, comment: '折扣描述' })
  description: string;

  // 关联商品表
  @OneToOne(() => Goods, (goods) => goods.discount)
  @JoinColumn()
  goods: Goods;
}
