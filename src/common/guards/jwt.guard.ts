import {
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth/auth.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConstantEnum } from '../enum/constant.enum';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    res.set('Access-Control-Expose-Headers', '');
    const accessToken = req.get('authorization');
    const refreshToken = req.get('refreshtoken');

    if (!accessToken) throw new UnauthorizedException('用户未登录');
    // 验证 access_token 是否有效
    let user = this.authService.verifyToken(accessToken);
    if (user) return this.activate(context);

    // 验证 refresh_token 是否有效
    user = this.authService.verifyToken(refreshToken);
    if (!user)
      throw new HttpException(
        { message: '当前登录已过期, 请重新登录' },
        ConstantEnum.LOGIN_EXPIRES_STATUS,
      );

    // 换 token 日志
    this.logger.log(
      JwtGuard.name,
      `${user.name}'使用 refreshToken 更换了 token`,
    );

    // 换 token
    const tokens = await this.authService.generateToken(user);
    req.headers['authorization'] = tokens.accessToken;
    req.headers['refreshtoken'] = tokens.refreshToken;
    res.set('Access-Control-Expose-Headers', 'authorization, refreshtoken');
    res.set('authorization', tokens.accessToken);
    res.set('refreshToken', tokens.refreshToken);
    return this.activate(context);
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}
