import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { Goods } from './goods.entity';
import { GoodsImg } from './goods-img.entity';
import { Category } from '../category/category.entity';
import { copyFile, createDir, removeFile } from '../common/utils/fs.utils';
import * as path from 'path';
import { FileConfig } from '../common/enum/config.enum';
import { QueryGoodsDto } from './dto/query-goods.dto';

const imgDir = path.join(__dirname, '../', FileConfig.GOODS_IMG_PATH);

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Goods)
    private readonly goodsRepository: Repository<Goods>,
    @InjectRepository(GoodsImg)
    private readonly goodsImgRepository: Repository<GoodsImg>,
  ) {}

  // 根据文件对象生成 实体
  async generateGoodsImg(files: Array<Express.Multer.File>) {
    const imgs: GoodsImg[] = [];
    for (const file of files) {
      const image = new GoodsImg();
      image.filename = file.filename;
      image.mimetype = file.mimetype;
      image.size = file.size;
      imgs.push(image);

      // 保存图片
      await copyFile(file.path, imgDir + file.filename);
      // 删除临时图片
      await removeFile(file.path);
    }
    return imgs;
  }

  // 新增商品
  async create(
    dto: CreateGoodDto,
    category: Category,
    files: Array<Express.Multer.File>,
  ) {
    const goods = new Goods();
    for (let key of Object.keys(dto)) {
      goods[key] = dto[key];
    }
    await createDir(imgDir);
    // 装载图片对象
    goods.imgs = await this.generateGoodsImg(files);
    goods.category = category;
    return this.goodsRepository.save(goods);
  }

  // 更改商品信息
  async update(
    id: number,
    dto: UpdateGoodDto,
    oldGoods: Goods,
    category: Category,
    files: Array<Express.Multer.File>,
  ) {
    const goodTemp = await this.goodsRepository.merge(oldGoods, {
      ...dto,
      category,
    });
    const goods = await this.goodsRepository.save(goodTemp);
    // 处理图片
    if (Array.isArray(files) && !!files.length) {
      const imgs = await this.generateGoodsImg(files);
      imgs.map((item) => {
        item.goods = goods;
        return item;
      });
      await this.goodsImgRepository.save(imgs);
    }
    await this.goodsRepository.update(id, { ...dto, category });
  }

  // 根据名称、类别 查询商品
  async findAll(dto: QueryGoodsDto) {
    const { page, size = 10, name, category } = dto;
    const qb = this.goodsRepository.createQueryBuilder('goods');
    qb.leftJoinAndSelect('goods.imgs', 'imgs');
    qb.leftJoinAndSelect('goods.category', 'category');
    category && qb.andWhere('goods.category = :category', { category });
    name && qb.andWhere('goods.name LIKE :name', { name: `%${name}%` });
    return qb
      .orderBy('goods.createAt', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
  }

  // 根据 id 查询商品信息
  findOne(id: number) {
    return this.goodsRepository.findOne({
      where: { id },
      relations: { imgs: true, evaluate: true, category: true },
    });
  }

  // 根据 id 删除商品
  async remove(goods: Goods) {
    for (const img of goods.imgs) {
      await removeFile(imgDir + img.filename);
    }
    return this.goodsRepository.remove(goods);
  }

  // 根据图片名称查询 商品图片对象
  async findGoodsImg(name: string) {
    return this.goodsImgRepository.findOne({ where: { filename: name } });
  }

  // 删除 商品图片
  async removeImg(img: GoodsImg) {
    await removeFile(imgDir + img.filename);
    await this.goodsImgRepository.remove(img);
  }
}
