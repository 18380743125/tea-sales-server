import { CreateUserDto } from '../../user/dto/create-user.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto extends CreateUserDto {
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码必须是字符串' })
  captcha: string;

  @IsBoolean()
  remember: boolean

  @IsOptional()
  flag: number
}
