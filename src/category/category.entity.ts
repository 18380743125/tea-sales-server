import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Goods } from '../goods/goods.entity';
import { Expose } from "class-transformer";

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ length: 20, comment: '类别名称' })
  @Expose()
  name: string;

  // 关联商品表
  @OneToMany(() => Goods, (goods) => goods.category)
  @Expose()
  goods: Goods[];

  @CreateDateColumn({ comment: '创建时间' })
  @Expose()
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Expose()
  updateAt: Date;
}
