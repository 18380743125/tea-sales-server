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
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';
import { User } from '../user/user.entity';
import { Goods } from '../goods/goods.entity';
import { Logistic } from '../logistics/logistic.entity';
import { Expose } from 'class-transformer';
import { Address } from '../address/address.entity';
import { Evaluate } from '../evaluate/evaluate.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    unsigned: true,
  } as ColumnNumericOptions)
  @Expose()
  money: number;

  @Column({ comment: '数量' })
  @Expose()
  count: number;

  @Column({ length: 1, default: '0', comment: '状态' })
  @Expose()
  state: string;

  @Column({ type: 'timestamp', nullable: true, comment: '订单结束时间' })
  @Expose()
  endTime: Date;

  @OneToOne(() => Logistic, (logistic) => logistic.order)
  @Expose()
  logistic: Logistic;

  // 评价表
  @OneToOne(() => Evaluate, (evaluate) => evaluate.order)
  @Expose()
  evaluate: Evaluate;

  // 关联用户表
  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  user: User;

  // 关联送货地址表
  @ManyToOne(() => Address, (address) => address.orders)
  @JoinColumn()
  @Expose()
  address: Address;

  // 关联商品表
  @ManyToOne(() => Goods, (goods) => goods.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  goods: Goods;

  @Column({ length: 1, default: '0', comment: '是否可见' })
  @Expose()
  invisible: string;

  @CreateDateColumn({ comment: '创建时间' })
  @Expose()
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Expose()
  updateAt: Date;
}
