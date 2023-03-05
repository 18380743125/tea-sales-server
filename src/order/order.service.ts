import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryOrderDto } from './dto/query-order.dto';
import { andConditionUtils } from '../common/utils/db.helper';
import { Goods } from '../goods/goods.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Goods)
    private readonly goodsRepository: Repository<Goods>,
  ) {}
  async create(dto: Order[]) {
    const orders = this.orderRepository.create(dto);
    for (const item of orders) {
      const goods = await this.goodsRepository.findOne({
        where: { id: item.goods.id },
      });
      goods.stock -= item.count;
      await this.goodsRepository.update(goods.id, goods);
    }
    return this.orderRepository.save(orders);
  }

  async findAll(dto: QueryOrderDto) {
    const { page, size = 10000, ...c } = dto;
    const qb = this.orderRepository.createQueryBuilder('order');
    qb.leftJoinAndSelect('order.goods', 'goods').leftJoinAndSelect(
      'goods.imgs',
      'imgs',
    );
    qb.leftJoinAndSelect('order.address', 'address');
    qb.leftJoinAndSelect('order.user', 'user');
    qb.leftJoinAndSelect('order.logistic', 'logistic');
    qb.leftJoinAndSelect('order.evaluate', 'evaluate');
    const condition = {
      'goods.name': c.goodsName,
      'order.state': c.state,
      'user.name': c.uname,
      'user.phone': c.phone,
    };
    andConditionUtils(qb, condition);
    return qb
      .addOrderBy('order.createAt', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
  }

  // 根据订单 ID 查询
  findOne(id: number) {
    return this.orderRepository.findOne({
      where: { id },
      relations: { user: true, goods: true },
    });
  }

  async update(id: number, state: string) {
    if (state === '3') {
      // 确认收货, 增加销量
      const order = await this.findOne(id);
      const goods = await this.goodsRepository.findOne({
        where: { id: order.goods.id },
      });
      goods.saleNums += order.count;
      await this.goodsRepository.update(goods.id, goods);
    }
    return this.orderRepository.update(id, { state });
  }

  // 删除订单, 将订单不向用户端展示
  remove(id: number, userId) {
    return this.orderRepository
      .createQueryBuilder('order')
      .update(Order)
      .set({ invisible: '1' })
      .andWhere('order.id = :id and order.userId = :userId', { id, userId })
      .execute();
  }
}
