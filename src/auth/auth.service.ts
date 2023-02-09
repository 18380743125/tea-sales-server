import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../common/enum/config.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  // 验证用户名密码是否正确
  async validateUser(user: User, password: string) {
    if (!user) return false;
    return argon2.verify(user.password, password);
  }

  // 生成 token
  async generateToken(user) {
    const appConfig = this.configService.get('app');

    const accessToken = await this.jwtService.signAsync(
      { id: user.id, name: user.name },
      { expiresIn: appConfig[AppConfig.TOKEN_EXPIRES] },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: user.id, name: user.name },
      { expiresIn: appConfig[AppConfig.REFRESH_TOKEN_EXPIRES] },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  // 验证 token
  verifyToken(token: string) {
    if (!token) return false;
    try {
      return this.jwtService.verify(token.replace('Bearer ', ''));
    } catch (e) {
      return false;
    }
  }
}
