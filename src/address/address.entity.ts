import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ length: 128, comment: '收货地区' })
  region: string;

  @Column({ length: 160, comment: '详细地址' })
  detail: string;

  @Column({ length: 1, default: '0', comment: '默认地址' })
  default: string;

  // 关联用户表
  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateAt: Date;
}
