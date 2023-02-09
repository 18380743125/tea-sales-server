import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { TypeormFilter } from '../common/filters/typeorm.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Serialize } from '../common/decorators/serialize.decorator';
import { User } from './user.entity';
import { ErrorEnum } from '../common/enum/error.enum';
import { RetUtils } from '../common/utils/ret.utils';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
@UseFilters(TypeormFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // 用户注册
  async create(@Body() dto: CreateUserDto) {
    await this.userService.create(dto);
    return new RetUtils();
  }

  @Get()
  // 多条件查询用户
  async findAll(@Body() dto: QueryUserDto) {
    const result = await this.userService.findAll(dto);
    return new RetUtils(200, 'ok', result);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @Serialize(User)
  // 根据 ID 查询用户
  async findOne(@Req() req, @Param('id') id: string) {
    const result = await this.userService.findOne(+id);
    return new RetUtils(200, 'ok', result);
  }

  @Patch(':id')
  // 更改用户信息
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    await this.userService.update(+id, dto);
    return new RetUtils();
  }

  @Delete(':id')
  // 删除用户
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(+id);
    const flag = result === ErrorEnum.NO_EXISTS;
    return new RetUtils(200, flag ? ErrorEnum.NO_EXISTS : 'ok');
  }
}
