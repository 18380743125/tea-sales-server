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
import { Expose } from "class-transformer";

@Entity()
export class EvaluateImg {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ comment: '图片名称' })
  @Expose()
  filename: string;

  @Column({ length: 64, comment: 'mimetype' })
  @Expose()
  mimetype: string;

  @Column({ comment: '字节数' })
  @Expose()
  size: number;

  // 关联评价表
  @ManyToOne(() => Evaluate, (evaluate) => evaluate.imgs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  evaluate: Evaluate;

  @CreateDateColumn({ comment: '创建时间' })
  @Expose()
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Expose()
  updateAt: Date;
}
