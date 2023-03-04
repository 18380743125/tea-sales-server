import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class QueryGoodsDto {
  @IsNumberString(null, { message: '页码必须是数字~' })
  @IsNotEmpty({ message: '页码不能为空~' })
  page: number;

  @IsOptional()
  @IsNumberString(null, { message: 'size 必须是数字~' })
  size: number;

  @IsOptional()
  @IsNumberString(null, { message: '类别ID必须是数字~' })
  category: number;

  @IsOptional()
  @IsString({ message: '商品名必须是字符串~' })
  @MaxLength(50, { message: '商品名长度不能超过50个字符~' })
  name: string;
}
