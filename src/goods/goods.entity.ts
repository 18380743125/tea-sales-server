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
import { Evaluate } from '../evaluate/evaluate.entity';
import { GoodsImg } from './goods-img.entity';
import { Order } from '../order/order.entity';
import { Logistic } from '../logistics/logistic.entity';
import { Expose } from "class-transformer";

@Entity()
export class Goods {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  @Expose()
  id: number;

  @Column({ length: 50, comment: '商品名称' })
  @Expose()
  name: string;

  @Column({ type: 'decimal', comment: '价格' })
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

  @OneToMany(() => Evaluate, (evaluate) => evaluate.goods)
  @Expose()
  evaluate: Evaluate[];

  @OneToMany(() => Logistic, (logistic) => logistic.goods)
  @Expose()
  logistic: Logistic[];

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
