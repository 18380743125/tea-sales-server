import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { Goods } from '../goods/goods.entity';
import { User } from '../user/user.entity';
import { andConditionUtils } from '../common/utils/db.helper';
import { QueryCartDto } from './dto/query-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
  ) {}

  // 加入购物车
  async create(dto: CreateCartDto, goods: Goods, user: User) {
    const cart = this.cartRepository.create({
      count: dto.count,
      checked: dto.checked,
      user,
      goods,
    });
    return this.cartRepository.save(cart);
  }

  // 更改购物车中的商品数量
  update(id: number, dto: UpdateCartDto) {
    return this.cartRepository.update(id, {
      count: dto.count,
      checked: dto.checked,
    });
  }

  // 根据用户 和 商品 ID 查询
  async findByUserIdAndGoodsId(userId: number, goodsId: number) {
    const qb = this.cartRepository.createQueryBuilder('cart');
    const condition = {
      'cart.userId': userId,
      'cart.goodsId': goodsId,
    };
    andConditionUtils(qb, condition);
    return qb.getOne();
  }

  // 根据用户 id 查询购物车
  async findAll(userId: number, dto: QueryCartDto) {
    const { page = 1, size = 10000 } = dto;
    const qb = this.cartRepository.createQueryBuilder('cart');
    qb.leftJoinAndSelect('cart.goods', 'goods');
    qb.leftJoinAndSelect('goods.imgs', 'imgs');
    qb.leftJoinAndSelect('goods.discount', 'discount');
    qb.where('cart.userId = :userId', { userId });
    return qb
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
  }

  // 根据购物车 ID 查询
  findOne(id: number) {
    return this.cartRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  // 根据 ID 删除购物车
  remove(id: number) {
    return this.cartRepository.delete(id);
  }

  // 清除用户购物车
  async removeChecked(userId: number) {
    const carts = await this.cartRepository.find({
      where: { user: { id: userId }, checked: true },
    });
    return this.cartRepository.remove(carts);
  }

  // 全选 / 全不选
  async checkAll(flag: number, userId: number) {
    const checked = !!flag;
    const carts = await this.cartRepository.find({
      where: { user: { id: userId } },
    });
    const ids = carts.map((item) => item.id);
    return this.cartRepository.update(ids, { checked });
  }
}
