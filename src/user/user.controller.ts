import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards
} from "@nestjs/common";
import { UserService } from './user.service';
import { TypeormFilter } from '../common/filters/typeorm.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Serialize } from '../common/decorators/serialize.decorator';
import { User } from './user.entity';
import { ErrorEnum } from '../common/enum/error.enum';
import { RetUtils } from '../common/utils/ret.utils';
import { JwtGuard } from '../common/guards/jwt.guard';
import { AuthService } from '../auth/auth.service';
import { UpdatePwdDto } from './dto/update-pwd.dto';

@Controller('user')
@UseFilters(TypeormFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

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
  @UseGuards(JwtGuard)
  // 更改用户信息
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id,
    @Body() dto: UpdateUserDto,
  ) {
    if (req.user.userId !== id) return new RetUtils(200, ErrorEnum.FORBIDDEN);
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

  // 修改密码
  @Post('update_pwd')
  @UseGuards(JwtGuard)
  async updatePwd(@Req() req, @Body() dto: UpdatePwdDto) {
    const user = await this.userService.findOneByName(req.user.name);
    if (!user) return new RetUtils(200, ErrorEnum.NO_EXISTS);
    const flag = await this.authService.validateUser(user, dto.oldpassword);
    if (!flag) {
      return new RetUtils(200, ErrorEnum.PASSWORD_ERROR);
    }
    const newPwd = await this.userService.handlePwdHash(dto.password);
    await this.userService.update(user.id, { password: newPwd });
    return new RetUtils();
  }
}
