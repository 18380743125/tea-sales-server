import {
  Controller,
  Get,
  Post,
  Body,
  Header,
  Session,
  Res,
  Req,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import * as svgCaptcha from 'svg-captcha';
import { LoginDto } from './dto/login.dto';
import { ErrorEnum } from '../common/enum/error.enum';
import { RetUtils } from '../common/utils/ret.utils';
import { ConstantEnum } from '../common/enum/constant.enum';
import { UserService } from '../user/user.service';
import { Cookie } from 'express-session';
import { generateCaptcha, verifyCaptcha } from '../common/config/captcha.util';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('captcha')
  @Header('Content-Type', 'image/svg+xml')
  // 生成验证码
  getCaptcha(@Session() session) {
    const captcha = generateCaptcha(session);
    return captcha.data;
  }

  // 服务端判断用户是否记住了密码
  @Post('remember')
  verifyRemember(@Req() req) {
    const user = req.signedCookies.user;
    return new RetUtils(200, 'ok', user || false);
  }

  @Post('login')
  // 用户登录
  async login(
    @Session() session,
    @Body() dto: LoginDto,
    @Req() req,
    @Res() res,
  ) {
    const errorMsg = verifyCaptcha(session, dto.captcha);
    if(errorMsg !== 'ok') return res.status(200).json(new RetUtils(200, errorMsg))
    if (dto.flag === ConstantEnum.ADMIN_FLAG) {
      // 校验是否是管理员
      const flag = await this.userService.validateAdmin(dto.name);
      if (!flag) {
        res.status(200).json(new RetUtils(200, ErrorEnum.NO_ADMIN_AUTH));
        return;
      }
    }

    // 验证用户名密码是否正确
    const user = await this.userService.findOneByName(dto.name);
    const flag = await this.authService.validateUser(user, dto.password);
    if (!flag) {
      res.status(200).json(new RetUtils(200, ErrorEnum.LOGIN_ERROR));
      return;
    }
    // 生成 TOKEN
    const token = await this.authService.generateToken(user);
    // 判断是否记住密码
    if (dto.remember) {
      res.cookie(
        'user',
        { name: dto.name, password: dto.password },
        {
          maxAge: 7 * 1000 * 60 * 60 * 24, // 一周
          signed: true,
          httpOnly: true,
        },
      );
    } else {
      res.clearCookie('user');
    }
    delete user.password;
    res.status(200).json(new RetUtils(200, 'ok', { ...token, user }));
  }

  // 注销登录
  @Post('/logout')
  logout(@Session() session) {
    session.destroy();
    return new RetUtils();
  }
}
