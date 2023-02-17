import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class QueryOrderDto {
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
  @IsString({ message: '订单状态必须是字符串~' })
  @MaxLength(1, { message: '订单状态只能是一个字符~' })
  state: string;

  @IsOptional()
  @IsString({ message: '用户名必须是字符串' })
  @MaxLength(32, { message: `用户名长度不能超过32个字符~` })
  uname: string;

  @IsOptional()
  @IsString({ message: '手机号必须是字符串~' })
  @IsMobilePhone('zh-CN', null, { message: '手机号格式错误~' })
  phone: string;
}
