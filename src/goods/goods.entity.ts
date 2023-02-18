import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Cart } from '../carts/cart.entity';
import { Discount } from '../discounts/discount.entity';
import { GoodsImg } from './goods-img.entity';
import { Order } from '../order/order.entity';
import { Expose } from 'class-transformer';
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';

@Entity()
export class Goods {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ length: 50, comment: '商品名称' })
  @Expose()
  name: string;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    unsigned: true,
  } as ColumnNumericOptions)
  @Expose()
  price: number;

  @Column({ default: 0, comment: '销量' })
  @Expose()
  saleNums: number;

  @Column({ comment: '库存' })
  @Expose()
  stock: number;

  @Column({ length: 50, comment: '重量参数' })
  @Expose()
  weight: string;

  @Column({ length: 60, comment: '商品描述' })
  @Expose()
  description: string;

  @Column({
    length: 1,
    default: '1',
    comment: '商品状态, 1 上架状态, 0 下架状态',
  })
  state: string;

  // 关联折扣表
  @OneToOne(() => Discount, (discount) => discount.goods)
  @Expose()
  discount: Discount;

  @OneToMany(() => Order, (order) => order.goods)
  @Expose()
  orders: Order[];

  @OneToMany(() => GoodsImg, (goodsImg) => goodsImg.goods, {
    cascade: ['insert'],
  })
  @Expose()
  imgs: GoodsImg[];

  // 关联类别表
  @ManyToOne(() => Category, (category) => category.goods, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  @Expose()
  category: Category;

  // 关联购物车表
  @ManyToMany(() => Cart, (cart) => cart.goods)
  @Expose()
  carts: Cart[];

  @CreateDateColumn({ comment: '创建时间' })
  @Expose()
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Expose()
  updateAt: Date;
}
