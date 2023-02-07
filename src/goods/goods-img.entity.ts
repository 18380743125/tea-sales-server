import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Goods } from "./goods.entity";

@Entity()
export class GoodsImg {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: '图片名称' })
  filename: string;

  @Column({ length: 64, comment: 'mimetype' })
  mimetype: string;

  @Column({ comment: '字节数' })
  size: number;

  @ManyToOne(() => Goods, (goods) => goods.imgs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  goods: Goods;

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateAt: Date;
}
