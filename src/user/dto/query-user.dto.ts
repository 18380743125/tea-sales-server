import { Optional } from '@nestjs/common';
import { IsInt, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { UpdateUserDto } from './update-user.dto';

export class QueryUserDto extends PartialType(UpdateUserDto) {
  @IsNotEmpty({ message: '页码不能为空' })
  @IsInt({ message: '页码必须是一个整数' })
  page: number;

  @Optional()
  @IsInt({ message: '页码必须是一个整数' })
  size?: number = 10;
}
