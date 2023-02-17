import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryOrderDto } from './dto/query-order.dto';
import { andConditionUtils } from '../common/utils/db.helper';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  create(dto: Order[]) {
    const orders = this.orderRepository.create(dto);
    return this.orderRepository.save(orders);
  }

  async findAll(dto: QueryOrderDto) {
    const { page, size = 10, ...c } = dto;
    const qb = this.orderRepository.createQueryBuilder('order');
    qb.leftJoinAndSelect('order.goods', 'goods').leftJoinAndSelect(
      'goods.imgs',
      'imgs',
    );
    qb.leftJoinAndSelect('order.address', 'address')
    qb.leftJoinAndSelect('order.user', 'user');
    qb.leftJoinAndSelect('order.logistic', 'logistic')
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

  update(id: number, state: string) {
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
