import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty({ message: '商品ID不能为空~' })
  @IsInt({ message: '商品ID必须是数字~' })
  id: number;

  @IsNotEmpty({ message: '折扣率不能为空~' })
  @IsNumber(
    {
      allowNaN: false,
      maxDecimalPlaces: 2,
    },
    { message: '折扣率必须是数字~' },
  )
  rate: number;

  @IsString({ message: '折扣商品描述必须是字符串~' })
  @MaxLength(20, { message: '折扣商品描述不能超过20个字符~' })
  description: string;
}
