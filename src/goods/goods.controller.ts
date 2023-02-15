import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CategoryService } from '../category/category.service';
import { RetUtils } from '../common/utils/ret.utils';
import { ErrorEnum } from '../common/enum/error.enum';
import { QueryGoodsDto } from './dto/query-goods.dto';
import { goodsFilesInterceptor } from './multer.config';
import { toNumber } from '../common/utils/format';

@Controller('goods')
export class GoodsController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  @UseInterceptors(goodsFilesInterceptor)
  // 新增商品
  async create(
    @Body() dto: CreateGoodDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    dto.price = toNumber(dto.price);
    dto.stock = toNumber(dto.stock);
    let category = await this.categoryService.findByName(dto.category);
    if (!category) {
      category = await this.categoryService.create({ name: dto.category });
    }
    delete dto.category;
    const result = await this.goodsService.create(dto, category, files);
    return new RetUtils(200, 'ok', result);
  }

  @Patch(':id')
  @UseInterceptors(goodsFilesInterceptor)
  @UseGuards(JwtGuard, AdminGuard)
  // 更改商品信息
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGoodDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const oldGoods = await this.goodsService.findOne(+id);
    if (!oldGoods) return new RetUtils(200, ErrorEnum.NO_EXISTS);
    dto.price = toNumber(dto.price);
    dto.stock = toNumber(dto.stock);
    let category = await this.categoryService.findByName(dto.category);
    delete dto.category;
    if (!category) {
      category = await this.categoryService.create({ name: dto.category });
    }
    await this.goodsService.update(+id, dto, oldGoods, category, files);
    return new RetUtils();
  }

  @Get()
  // 多条件查询商品(可根据商品类别, 商品名称查询)
  async findAll(@Query() dto: QueryGoodsDto) {
    const result = await this.goodsService.findAll(dto);
    return new RetUtils(200, 'ok', result);
  }

  @Get(':id')
  // 根据 id 查询商品信息
  async findOne(@Param('id') id: string) {
    const result = await this.goodsService.findOne(+id);
    return new RetUtils(200, 'ok', result);
  }

  @Delete(':id')
  // 根据 id 删除商品
  async remove(@Param('id') id: string) {
    const goods = await this.goodsService.findOne(+id);
    if (!goods) return new RetUtils(200, ErrorEnum.NO_EXISTS);
    await this.goodsService.remove(goods);
    return new RetUtils();
  }

  // 根据商品图片名称 删除图片
  @Delete('remove_img/:name')
  async removeImg(@Param('name') name) {
    const img = await this.goodsService.findGoodsImg(name);
    if (!img) return new RetUtils(200, ErrorEnum.NO_EXISTS);
    await this.goodsService.removeImg(img);
    return new RetUtils();
  }

  @Get('img/:id')
  // 根据商品 id 查询图片
  async findAllImg(@Param('id', ParseIntPipe) id) {
    const img = await this.goodsService.findAllImg(id);
    return new RetUtils(200, 'ok', img);
  }
}
