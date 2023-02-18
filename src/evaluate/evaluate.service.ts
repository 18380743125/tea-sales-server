import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { CreateEvaluateDto } from './dto/create-evaluate.dto';
import { UpdateEvaluateDto } from './dto/update-evaluate.dto';
import { Goods } from '../goods/goods.entity';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluate } from './evaluate.entity';
import { Repository } from 'typeorm';
import { EvaluateImg } from './evaluate-img.entity';
import { QueryEvaluateDto } from './dto/query-evaluate.dto';
import { andConditionUtils } from '../common/utils/db.helper';
import { removeFile } from '../common/utils/fs.utils';
import { Order } from 'src/order/order.entity';

@Injectable()
export class EvaluateService {
  constructor(
    @InjectRepository(Evaluate)
    private readonly evaluateRepository: Repository<Evaluate>,
    @InjectRepository(EvaluateImg)
    private readonly evaluateImgRepository: Repository<EvaluateImg>,
  ) {}

  // 添加评论
  async create(
    dto: CreateEvaluateDto,
    order: Order,
    user: User,
    files: Array<Express.Multer.File>,
  ) {
    const evaluate = new Evaluate();
    evaluate.order = order;
    evaluate.user = user;
    evaluate.star = dto.star;
    evaluate.content = dto.content;
    const imgs = [] as EvaluateImg[];
    if (files && Array.isArray(files)) {
      for (const file of files) {
        const img = new EvaluateImg();
        img.filename = file.filename;
        img.mimetype = file.mimetype;
        img.size = file.size;
        imgs.push(img);
      }
    }
    evaluate.imgs = imgs;
    return this.evaluateRepository.save(evaluate);
  }

  // 根据用户名，商品名称查询评论
  async findAll(dto: QueryEvaluateDto) {
    const { page = 1, size = 10 } = dto;
    const qb = this.evaluateRepository.createQueryBuilder('evaluate');
    qb.leftJoinAndSelect('evaluate.user', 'user').leftJoinAndSelect(
      'user.avatar',
      'avatar',
    );
    qb.leftJoinAndSelect('evaluate.imgs', 'imgs');
    qb.leftJoinAndSelect('evaluate.order', 'order').leftJoinAndSelect(
      'order.goods',
      'goods',
    );
    const conditions = {
      'user.name': dto.uname,
      'goods.name': dto.goodsName,
    };
    andConditionUtils(qb, conditions);
    return qb
      .orderBy('evaluate.createAt', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
  }

  // 根据评论 ID 查询
  findOne(id: number) {
    return this.evaluateRepository.findOne({
      where: { id },
      relations: { user: true, imgs: true, order: true },
    });
  }

  // 删除评价
  async remove(id: number) {
    const imgs = await this.evaluateImgRepository.find({
      where: { evaluate: { id } },
    });
    // 删除评价图片
    for (const img of imgs) {
      await removeFile(
        path.join(__dirname, '../images/evaluate', img.filename),
      );
    }
    return this.evaluateRepository.delete(id);
  }

  // 修改评价
  update(id: number, dto: UpdateEvaluateDto) {
    const { star, content } = dto;
    const obj: any = {};
    typeof star !== 'undefined' && (obj.star = star);
    content && (obj.content = content);
    return this.evaluateRepository.update(id, obj);
  }
}
