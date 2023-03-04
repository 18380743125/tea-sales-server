import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Expose } from 'class-transformer';
import { Order } from '../order/order.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ length: 100, comment: '收货人姓名' })
  @Expose()
  name: string;

  @Column({ length: 160, comment: '收货人手机号' })
  @Expose()
  tel: string;

  @Column({ length: 255, comment: '详细地址' })
  @Expose()
  address: string;

  @Column({ length: 1, default: '0', comment: '默认地址' })
  @Expose()
  isDefault: string;

  @OneToMany(() => Order, (order) => order.address)
  @Expose()
  orders: Order[];

  // 关联用户表
  @ManyToOne(() => User, (user) => user.addresses, {
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
