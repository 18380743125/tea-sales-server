import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { User } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  // 验证用户名密码是否正确
  async validateUser(user: User, password: string) {
    if (!user) return false;
    return argon2.verify(user.password, password);
  }

  async generateToken(user) {
    return this.jwtService.signAsync({ id: user.id, name: user.name });
  }
}
