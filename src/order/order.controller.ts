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
  Req,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { GoodsService } from '../goods/goods.service';
import { Order } from './order.entity';
import { ErrorEnum } from '../common/enum/error.enum';
import { RetUtils } from '../common/utils/ret.utils';
import { AddressService } from '../address/address.service';
import { UserService } from '../user/user.service';
import { Serialize } from '../common/decorators/serialize.decorator';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly goodsService: GoodsService,
    private readonly addressService: AddressService,
    private readonly userService: UserService,
  ) {}

  @Post(':address')
  @UseGuards(JwtGuard)
  async create(
    @Req() req,
    @Param('address', ParseIntPipe) addressId,
    @Body() dto: CreateOrderDto[],
  ) {
    const address = await this.addressService.findOne(addressId);
    if (!address) return new RetUtils(200, ErrorEnum.ADDRESS_NO_EXISTS);
    const user = await this.userService.findOne(req.user.userId);

    // 订单必须传数组
    if (!Array.isArray(dto)) return new RetUtils(200, ErrorEnum.PARAMS);

    // 处理订单数据
    const orders: Order[] = [];

    for (const item of dto) {
      const goods = await this.goodsService.findOne(item.goodsId);
      if (!goods) return new RetUtils(200, ErrorEnum.NO_EXISTS);
      if (goods.stock < item.count) {
        return new RetUtils(200, ErrorEnum.UNDER_STOCK);
      }
      // 装载订单信息
      const order = new Order();
      order.goods = goods;
      order.count = item.count;
      order.money = item.money;
      order.address = address;
      order.user = user;
      orders.push(order);
    }

    this.orderService.create(orders);
    return new RetUtils();
  }

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  // 多条件查询订单信息, 订单状态、商品名称、用户名、手机号 查询
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @Serialize(Order)
  // 根据订单 ID 查询订单信息
  async findOne(@Req() req, @Param('id') id: string) {
    if (!this._isCanOperation(+id, req.user.userId)) {
      return new RetUtils(200, ErrorEnum.FORBIDDEN);
    }
    const order = await this.orderService.findOne(+id);
    return new RetUtils(200, 'ok', order);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: string,
    @Query('state') state,
  ) {
    if (!state || state.length !== 1) {
      return new RetUtils(200, ErrorEnum.PARAMS);
    }
    const user = await this.userService.findOne(req.user.userId);
    const isAdmin = await this.userService.validateAdmin(req.user.name);
    const isCan = await this._isCanOperation(+id, user.id);

    // 不是管理员也不是该订单的所属者
    if (!isAdmin && !isCan) return new RetUtils(200, ErrorEnum.FORBIDDEN);

    await this.orderService.update(+id, state);
    return new RetUtils();
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Req() req, @Param('id') id: string) {
    const user = req.user;
    const flag = await this._isCanOperation(+id, user.userId);
    if (!flag) return new RetUtils(200, ErrorEnum.FORBIDDEN);

    await this.orderService.remove(+id, user.userId);
    return new RetUtils();
  }

  // 当前用户是否可以操作
  async _isCanOperation(id: number, userId: number) {
    const order = await this.orderService.findOne(+id);
    if (!order) return false;
    // 违规操作
    return order.user.id === userId;
  }
}
