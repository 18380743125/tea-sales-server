import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Avatar {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ comment: '文件名称' })
  @Expose()
  filename: string;

  @Column({ length: 64, comment: 'mimetype' })
  @Expose()
  mimetype: string;

  @Column({ comment: '字节数' })
  @Expose()
  size: number;

  // 用户
  @OneToOne(() => User, (user) => user.avatar, { onDelete: 'CASCADE' })
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
