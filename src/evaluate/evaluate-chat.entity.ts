import { User } from 'src/user/user.entity';
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
export class EvaluateChat {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ length: 150, comment: '聊天内容' })
  @Expose()
  content: string;

  @Column({ nullable: true, comment: '父级聊天ID' })
  @Expose()
  parentId: number;

  @ManyToOne(() => User, (user) => user.evaluateChat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Expose()
  user: User;

  // 关联评价表
  @ManyToOne(() => Evaluate, (evaluate) => evaluate.chats, {
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
