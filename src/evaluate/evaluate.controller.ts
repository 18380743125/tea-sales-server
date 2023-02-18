import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Req,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { EvaluateService } from './evaluate.service';
import { CreateEvaluateDto } from './dto/create-evaluate.dto';
import { UpdateEvaluateDto } from './dto/update-evaluate.dto';
import { evaluateFileInterceptor } from 'src/common/config/multer.config';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RetUtils } from '../common/utils/ret.utils';
import { UserService } from '../user/user.service';
import { GoodsService } from '../goods/goods.service';
import { ErrorEnum } from '../common/enum/error.enum';
import { AdminGuard } from '../common/guards/admin.guard';
import { QueryEvaluateDto } from './dto/query-evaluate.dto';
import { Serialize } from '../common/decorators/serialize.decorator';
import { Evaluate } from './evaluate.entity';
import { OrderService } from "../order/order.service";

@Controller('evaluate')
export class EvaluateController {
  constructor(
    private readonly evaluateService: EvaluateService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @UseInterceptors(evaluateFileInterceptor)
  @UseGuards(JwtGuard)
  // 添加评价
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
    @Body() dto: CreateEvaluateDto,
  ) {
    const { userId } = req.user;
    const user = await this.userService.findOne(userId);
    const order = await this.orderService.findOne(dto.orderId);
    if (!order) return new RetUtils(200, ErrorEnum.NO_EXISTS);
    await this.evaluateService.create(dto, order, user, files);
    return new RetUtils();
  }

  @Get()
  @UseGuards(JwtGuard)
  @Serialize(Evaluate)
  // 多条件查询评价
  async findAll(@Query() dto: QueryEvaluateDto) {
    const evaluates = await this.evaluateService.findAll(dto);
    return new RetUtils(200, 'ok', evaluates);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @Serialize(Evaluate)
  // 根据评价 ID 查询
  async findOne(@Param('id') id: string) {
    const evaluate = await this.evaluateService.findOne(+id);
    return new RetUtils(200, 'ok', evaluate);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, AdminGuard)
  // 根据 ID 删除评价
  async remove(@Param('id') id: string) {
    const evaluate = await this.evaluateService.findOne(+id);
    if (!evaluate) return new RetUtils(200, ErrorEnum.NO_EXISTS);
    await this.evaluateService.remove(+id);
    return new RetUtils();
  }

  @Patch(':id')
  // 修改评价
  async update(@Param('id') id: string, @Body() dto: UpdateEvaluateDto) {
    await this.evaluateService.update(+id, dto);
    return new RetUtils();
  }
}
