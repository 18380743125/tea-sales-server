import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { userId } = req.user;
    const user = await this.userService.findOne(userId);
    if (!user) return;
    const isAdmin = user.roles.filter((item) => item.name === '管理员').length;
    return !!isAdmin;
  }
}
