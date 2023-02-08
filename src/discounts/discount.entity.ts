import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Goods } from '../goods/goods.entity';
import { Expose } from "class-transformer";

@Entity()
export class Discount {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ type: 'float', comment: '折扣率' })
  @Expose()
  rate: number;

  @Column({ nullable: true, length: 20, comment: '折扣描述' })
  @Expose()
  description: string;

  // 关联商品表
  @OneToOne(() => Goods, (goods) => goods.discount)
  @JoinColumn()
  @Expose()
  goods: Goods;
}
