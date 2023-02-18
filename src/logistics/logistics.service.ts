import { Injectable } from '@nestjs/common';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Logistic } from './logistic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogisticsService {
  constructor(
    @InjectRepository(Logistic)
    private readonly logisticRepository: Repository<Logistic>,
  ) {}

  // 发货处理
  async create(order: Order, user: User, way) {
    const logistics = await this.logisticRepository.create({
      order,
      user,
      way,
    });
    return this.logisticRepository.save(logistics);
  }

  // 根据订单 ID 查询物流信息
  findByOrderId(orderId: number) {
    return this.logisticRepository.findOne({
      where: { order: { id: orderId } },
    });
  }

  // 根据物流 ID 查询
  findOne(id: number) {
    return this.logisticRepository.findOne({
      where: { id },
      relations: { order: true, user: true },
    });
  }

  update(id: number, state: string) {
    return this.logisticRepository.update(id, { state });
  }
}
