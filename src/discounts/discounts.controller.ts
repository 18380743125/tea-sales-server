import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { GoodsService } from '../goods/goods.service';
import { RetUtils } from '../common/utils/ret.utils';
import { ErrorEnum } from '../common/enum/error.enum';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { toNumber } from '../common/utils/format';

@Controller('discounts')
export class DiscountsController {
  constructor(
    private readonly discountsService: DiscountsService,
    private readonly goodsService: GoodsService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  // 创建折扣
  async create(@Body() dto: CreateDiscountDto) {
    const goods = await this.goodsService.findOne(dto.id);
    // 添加折扣的商品不存在
    if (!goods) {
      return new RetUtils(200, ErrorEnum.NO_EXISTS);
    }
    const discount = await this.discountsService.findOneByGoodsId(dto.id);
    delete dto.id;

    // 折扣已存在, 执行更新操作
    if (discount) {
      await this.discountsService.update(discount.id, dto);
      return new RetUtils();
    }

    await this.discountsService.create(dto, goods);
    return new RetUtils();
  }

  @Patch(':id')
  // 更改折扣信息
  async update(@Param('id') id: string, @Body() dto: UpdateDiscountDto) {
    delete dto.id;
    const discount = await this.discountsService.findOne(+id);
    if (!discount) return new RetUtils(200, ErrorEnum.NO_EXISTS);
    await this.discountsService.update(+id, dto);
    return new RetUtils();
  }

  @Get()
  // 查询折扣
  async findAll(@Query() dto) {
    if (!dto.size) dto.size = 10;
    dto.page = toNumber(dto.page);
    dto.size = toNumber(dto.size);
    console.log(dto);
    const discounts = await this.discountsService.findAll(dto);
    return new RetUtils(200, 'ok', discounts);
  }

  @Get(':id')
  // 根据折扣 ID 查询
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const discount = await this.discountsService.findOne(+id);
    return new RetUtils(200, 'ok', discount);
  }

  @Get('/goods/:id')
  // 根据商品 ID 查询
  async findOneByGoodsId(@Param('id', ParseIntPipe) id: string) {
    const discount = await this.discountsService.findOneByGoodsId(+id);
    return new RetUtils(200, 'ok', discount);
  }

  @Delete(':id')
  // 根据折扣 ID 删除折扣
  async remove(@Param('id', ParseIntPipe) id: string) {
    const discount = await this.discountsService.findOne(+id);
    if (!discount) return new RetUtils(200, ErrorEnum.NO_EXISTS);
    await this.discountsService.remove(discount);
    return new RetUtils();
  }
}
