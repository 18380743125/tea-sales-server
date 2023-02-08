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
import { Expose } from "class-transformer";

@Entity()
export class Address {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ length: 128, comment: '收货地区' })
  @Expose()
  region: string;

  @Column({ length: 160, comment: '详细地址' })
  @Expose()
  detail: string;

  @Column({ length: 1, default: '0', comment: '默认地址' })
  @Expose()
  default: string;

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
