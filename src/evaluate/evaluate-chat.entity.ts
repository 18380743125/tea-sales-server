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

@Entity()
export class EvaluateChat {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ length: 150, comment: '聊天内容' })
  content: string;

  @Column({ nullable: true, comment: '父级聊天ID' })
  parentId: number;

  @ManyToOne(() => User, (user) => user.evaluateChat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  // 关联评价表
  @ManyToOne(() => Evaluate, (evaluate) => evaluate.chats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  evaluate: Evaluate;

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateAt: Date;
}
