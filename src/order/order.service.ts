import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  findAll() {
    return `This action returns all order`;
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
