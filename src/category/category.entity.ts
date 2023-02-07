import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Goods } from '../goods/goods.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ length: 20, comment: '类别名称' })
  name: string;

  // 关联商品表
  @OneToMany(() => Goods, (goods) => goods.category)
  goods: Goods[];

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateAt: Date;
}
