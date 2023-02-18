import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { CreateLogisticDto } from './dto/create-logistic.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import { RetUtils } from '../common/utils/ret.utils';
import { ErrorEnum } from '../common/enum/error.enum';
import { Serialize } from '../common/decorators/serialize.decorator';
import { Logistic } from './logistic.entity';

@Controller('logistics')
export class LogisticsController {
  constructor(
    private readonly logisticsService: LogisticsService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  // 发货(创建物流单号)
  async create(@Req() req, @Body() dto: CreateLogisticDto) {
    const user = await this.userService.findOne(dto.userId);
    // 用户不存在, forbidden
    if (!user) return new RetUtils(200, ErrorEnum.FORBIDDEN);

    const logistic = await this.logisticsService.findByOrderId(dto.orderId);
    const order = await this.orderService.findOne(dto.orderId);
    // 订单不存在或不是已支付状态, forbidden
    if (!order || order.state !== '1' || logistic) {
      return new RetUtils(200, ErrorEnum.FORBIDDEN);
    }

    await this.logisticsService.create(order, user, dto.way);
    return new RetUtils();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @Serialize(Logistic)
  // 根据物流单号查询物流信息
  async findOne(@Param('id') id: string) {
    const logistics = await this.logisticsService.findOne(+id);
    return new RetUtils(200, 'ok', logistics);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(@Param('id') id: string, @Body() dto) {
    const { state } = dto;
    if (!state || typeof state !== 'string' || state.length > 20) {
      return new RetUtils(200, ErrorEnum.PARAMS);
    }
    await this.logisticsService.update(+id, state);
    return new RetUtils();
  }
}
