import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePwdDto {
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 32, { message: `密码长度必须在$constraint1到$constraint2位之间` })
  oldpassword: string;

  @IsString({ message: '新密码必须是字符串' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @Length(6, 32, { message: `新密码长度必须在$constraint1到$constraint2位之间` })
  password: string;
}
