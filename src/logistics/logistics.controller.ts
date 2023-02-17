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
} from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { CreateLogisticDto } from './dto/create-logistic.dto';
import { UpdateLogisticDto } from './dto/update-logistic.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';

@Controller('logistics')
export class LogisticsController {
  constructor(
    private readonly logisticsService: LogisticsService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  async create(@Req() req, @Body() dto: CreateLogisticDto) {
    const user = await this.userService.findOne(dto.userId)

    return this.logisticsService.create(dto);
  }

  @Get()
  findAll() {
    return this.logisticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logisticsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLogisticDto: UpdateLogisticDto,
  ) {
    return this.logisticsService.update(+id, updateLogisticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logisticsService.remove(+id);
  }
}
