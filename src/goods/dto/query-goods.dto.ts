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
  size;

  @IsOptional()
  @IsString({ message: '类别名称必须是字符串~' })
  @MaxLength(20, { message: '类别名称长度不能超过20个字符~' })
  category: string;

  @IsOptional()
  @IsString({ message: '商品名必须是字符串~' })
  @MaxLength(50, { message: '商品名长度不能超过50个字符~' })
  name: string;
}
