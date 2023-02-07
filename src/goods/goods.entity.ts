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

@Entity()
export class Goods {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ length: 50, comment: '商品名称' })
  name: string;

  @Column({ type: 'decimal', comment: '价格' })
  price: number;

  @Column({ default: 0, comment: '销量' })
  saleNums: number;

  @Column({ comment: '库存' })
  stock: number;

  @Column({ length: 50, comment: '重量参数' })
  weight: string;

  @Column({ length: 60, comment: '商品描述' })
  description: string;

  // 关联折扣表
  @OneToOne(() => Discount, (discount) => discount.goods)
  discount: Discount;

  @OneToMany(() => Order, (order) => order.goods)
  orders: Order[];

  @OneToMany(() => GoodsImg, (goodsImg) => goodsImg.goods, {
    cascade: ['insert'],
  })
  imgs: GoodsImg[];

  @OneToMany(() => Evaluate, (evaluate) => evaluate.goods)
  evaluate: Evaluate[];

  @OneToMany(() => Logistic, (logistic) => logistic.goods)
  logistic: Logistic[];

  // 关联类别表
  @ManyToOne(() => Category, (category) => category.goods, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  category: Category;

  // 关联购物车表
  @ManyToMany(() => Cart, (cart) => cart.goods)
  carts: Cart[];

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateAt: Date;
}
