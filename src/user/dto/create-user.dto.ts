import { IsNotEmpty, IsString, Length, Allow } from 'class-validator';
import { Role } from 'src/role/role.entity';

export class CreateUserDto {
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(4, 32, {
    message: `用户名长度必须在$constraint1到$constraint2位之间`,
  })
  name: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 32, { message: `密码长度必须在$constraint1到$constraint2位之间` })
  password: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码必须是字符串' })
  captcha: string;

  @Allow()
  roles?: Role[] | string[];
}
