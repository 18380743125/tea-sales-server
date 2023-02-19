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
  ParseIntPipe,
} from '@nestjs/common';
import { EvaluateService } from './evaluate.service';
import { CreateEvaluateDto } from './dto/create-evaluate.dto';
import { UpdateEvaluateDto } from './dto/update-evaluate.dto';
import { evaluateFileInterceptor } from 'src/common/config/multer.config';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RetUtils } from '../common/utils/ret.utils';
import { UserService } from '../user/user.service';
import { ErrorEnum } from '../common/enum/error.enum';
import { AdminGuard } from '../common/guards/admin.guard';
import { QueryEvaluateDto } from './dto/query-evaluate.dto';
import { Serialize } from '../common/decorators/serialize.decorator';
import { Evaluate } from './evaluate.entity';
import { OrderService } from '../order/order.service';
import { PublishCommentDto } from './dto/publish-comment.dto';
import { EvaluateChat } from './evaluate-chat.entity';
import { processComment } from '../common/utils/comment.util';

@Controller('evaluate')
export class EvaluateController {
  constructor(
    private readonly evaluateService: EvaluateService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  // 评价的评论管理
  // 根据评价ID 查询评论
  @Get('/comment/:id')
  async getEvaComment(@Param('id', ParseIntPipe) id) {
    const commentsTemp = await this.evaluateService.findComments(+id);
    const comments = processComment(commentsTemp[0]);
    return new RetUtils(200, 'ok', [comments, commentsTemp[1]]);
  }

  // 发表评论
  @Post('/comment')
  @UseGuards(JwtGuard)
  async publishComment(@Req() req, @Body() dto: PublishCommentDto) {
    const { userId } = req.user;
    const user = await this.userService.findOne(userId);

    const evaluate = await this.evaluateService.findOne(dto.evaluateId);
    if (!evaluate) return new RetUtils(200, ErrorEnum.NO_EXISTS);

    await this.evaluateService.publishComment(user, evaluate, dto);
    return new RetUtils();
  }

  @Delete('/comment')
  @UseGuards(JwtGuard, AdminGuard)
  // 根据评论 ID 删除评论
  async removeComment(@Body('ids') ids) {
    if (!Array.isArray(ids) || !ids.every((item) => typeof item === 'number')) {
      return new RetUtils(200, ErrorEnum.PARAMS);
    }
    await this.evaluateService.removeComment(ids);
    return new RetUtils();
  }

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
