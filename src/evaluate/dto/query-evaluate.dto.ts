import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class QueryEvaluateDto {
  @IsNotEmpty({ message: '页码不能为空~' })
  @IsNumberString(null, { message: '页码必须是数字~' })
  page: number;

  @IsOptional()
  @IsNumberString(null, { message: 'size必须是数字~' })
  size: number;

  @IsOptional()
  @IsString({ message: '商品名称必须是字符串~' })
  @MaxLength(30, { message: '商品名称不能超过30个字符~' })
  goodsName: string;

  @IsOptional()
  @IsString({ message: '用户名必须是字符串' })
  @MaxLength(32, { message: `用户名长度不能超过32个字符~` })
  uname: string;
}
