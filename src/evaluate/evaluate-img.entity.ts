import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Evaluate } from './evaluate.entity';

@Entity()
export class EvaluateImg {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '图片名称' })
  filename: string;

  @Column({ length: 64, comment: 'mimetype' })
  mimetype: string;

  @Column({ comment: '字节数' })
  size: number;

  // 关联评价表
  @ManyToOne(() => Evaluate, (evaluate) => evaluate.imgs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  evaluate: Evaluate;

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateAt: Date;
}
