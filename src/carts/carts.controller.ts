import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RetUtils } from '../common/utils/ret.utils';
import { GoodsService } from '../goods/goods.service';
import { ErrorEnum } from '../common/enum/error.enum';
import { UserService } from '../user/user.service';
import { QueryCartDto } from './dto/query-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly goodsService: GoodsService,
    private readonly userService: UserService,
  ) {}

  @Post()
  // 加入购物车
  @UseGuards(JwtGuard)
  async create(@Req() req, @Body() dto: CreateCartDto) {
    const user = await this.userService.findOne(req.user.userId);
    const goods = await this.goodsService.findOne(dto.goodsId);
    if (!goods) return new RetUtils(200, ErrorEnum.NO_EXISTS);

    // 已经在购物车则更新 count 即可
    const cart = await this.cartsService.findByUserIdAndGoodsId(
      user.id,
      goods.id,
    );

    // 该商品已添加过购物车
    if (cart) {
      dto.count += cart.count;
      await this.cartsService.update(cart.id, dto);
      return new RetUtils();
    }

    // 加入购物车(第一次加)
    await this.cartsService.create(dto, goods, user);
    return new RetUtils();
  }

  @Get()
  @UseGuards(JwtGuard)
  // 根据用户查询 购物车信息
  async findAll(@Req() req, @Query() dto: QueryCartDto) {
    const { userId } = req.user;
    const carts = await this.cartsService.findAll(userId, dto);
    return new RetUtils(200, 'ok', carts);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateCartDto,
  ) {
    const cart = await this.cartsService.findByUserIdAndGoodsId(
      req.user.userId,
      dto.goodsId,
    );

    // 违规更改, 购物车不存在
    if (!cart) {
      return new RetUtils(200, ErrorEnum.NO_EXISTS);
    }

    dto.count += cart.count;

    await this.cartsService.update(+id, dto);
    return new RetUtils();
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Req() req, @Param('id', ParseIntPipe) id: string) {
    const cart = await this.cartsService.findOne(+id);

    // 该购物车记录不存在
    if (!cart) {
      return new RetUtils(200, ErrorEnum.NO_EXISTS);
    }

    // 校验该购物车是否属于该用户
    if (req.user.userId !== cart.user.id) {
      return new RetUtils(200, ErrorEnum.FORBIDDEN);
    }

    await this.cartsService.remove(+id);
    return new RetUtils();
  }
}
