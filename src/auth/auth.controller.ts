import {
  Controller,
  Get,
  Post,
  Body,
  Header,
  Session,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import * as svgCaptcha from 'svg-captcha';
import { LoginDto } from './dto/login.dto';
import { ErrorEnum } from '../common/enum/error.enum';
import { RetUtils } from '../common/utils/ret.utils';
import { ConstantEnum } from '../common/enum/constant.enum';
import { UserService } from '../user/user.service';

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
    const captcha = svgCaptcha.create({
      color: true,
      noise: 4,
    });
    session.captcha = {
      text: captcha.text.toLowerCase(),
      time: Date.now(),
    };
    return captcha.data;
  }

  @Post('login')
  // 用户登录
  async login(@Session() session, @Body() dto: LoginDto, @Res() res) {
    const captcha = session.captcha;
    // 验证码不存在
    if (!captcha) {
      res.status(200).json(new RetUtils(200, ErrorEnum.CAPTCHA_ERROR));
      return;
    }

    // 验证码是否过期
    const diff = (Date.now() - captcha.time) / 1000;
    if (diff > ConstantEnum.CAPTCHA_EXPIRES_TIME) {
      delete session.captcha;
      res.status(200).json(new RetUtils(200, ErrorEnum.CAPTCHA_EXPIRES));
      return;
    }
    // 验证码是否正确
    if (captcha.text !== dto.captcha.toLowerCase()) {
      delete session.captcha;
      res.status(200).json(new RetUtils(200, ErrorEnum.CAPTCHA_ERROR));
      return;
    }

    // 验证用户名密码是否正确
    const user = await this.userService.findOneByName(dto.name);
    const flag = this.authService.validateUser(user, dto.password);
    if (!flag) {
      res.status(200).json(new RetUtils(200, ErrorEnum.LOGIN_ERROR));
      return;
    }
    // 生成 TOKEN
    const token = await this.authService.generateToken(user);
    res.status(200).json(new RetUtils(200, 'ok', { token }));
  }
}
