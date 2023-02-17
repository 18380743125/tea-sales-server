import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateGoodDto {
  @IsNotEmpty({ message: '商品名称不能为空~' })
  @IsString({ message: '商品名称必须是字符串~' })
  @MaxLength(30, { message: '商品名称不能超过30个字符~' })
  name: string;

  @IsNotEmpty({ message: '商品价格不能为空~' })
  @IsNumberString(null, { message: '商品价格必须是数字~' })
  price: number;

  @IsNotEmpty({ message: '商品库存不能为空~' })
  @IsNumberString(null, { message: '商品库存必须是整数~' })
  stock: number;

  @IsNotEmpty({ message: '商品重量参数不能为空~' })
  @IsString({ message: '商品重量必须是字符串~' })
  weight: string;

  @IsNotEmpty({ message: '商品描述不能为空~' })
  @IsString({ message: '商品描述必须是字符串~' })
  description: string;

  @IsNotEmpty({ message: '商品类别不能为空~' })
  @IsString({ message: '商品类别必须是字符串~' })
  category: string;
}
