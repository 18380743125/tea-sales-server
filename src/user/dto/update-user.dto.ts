import {
  IsInt,
  IsMobilePhone,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: '性别必须是字符串~' })
  @MaxLength(1, { message: '性别必须是一个字符~' })
  gender?: string;

  @IsOptional()
  @IsInt({ message: '年龄必须是一个数字~' })
  @Min(0, { message: '年龄不能小于0~' })
  @Max(120, { message: '年龄不能超过120~' })
  age?: number;

  @IsOptional()
  @IsString({ message: '手机号必须是字符串~' })
  @IsMobilePhone('zh-CN', null, { message: '手机号格式错误~' })
  phone?: string;

  @IsOptional()
  @IsString({ message: '禁用状态必须是字符串~' })
  @MaxLength(1, { message: '禁用状态必须是一个字符~' })
  banned?: string;
}
