import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Goods } from '../goods/goods.entity';
import { Repository } from 'typeorm';
import { Discount } from './discount.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  // 创建折扣
  create(dto: CreateDiscountDto, goods: Goods) {
    const discount = this.discountRepository.create({ ...dto, goods });
    // console.log(discount);
    return this.discountRepository.save(discount);
  }

  // 查询折扣
  async findAll(dto: any) {
    const { page, size } = dto;
    const qb = this.discountRepository.createQueryBuilder('discount');
    qb.leftJoinAndSelect('discount.goods', 'goods');
    qb.skip((page - 1) * size).take(size);
    return qb.getManyAndCount();
  }

  // 根据折扣 ID 查询
  findOne(id: number) {
    return this.discountRepository.findOne({
      where: { id },
      relations: { goods: true },
    });
  }

  // 根据商品 ID 查折扣
  findOneByGoodsId(id: number) {
    const qb = this.discountRepository.createQueryBuilder('discounts');
    qb.innerJoinAndSelect('discounts.goods', 'goods').andWhere(
      'goods.id = :id',
      { id },
    );
    return qb.getOne();
  }

  // 更改折扣信息
  update(id: number, dto: UpdateDiscountDto) {
    return this.discountRepository.update(id, { ...dto });
  }

  // 删除折扣
  remove(discount: Discount) {
    return this.discountRepository.remove(discount);
  }
}
