import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty({ message: '商品ID不能为空~' })
  @IsInt({ message: '商品ID必须是数字' })
  goodsId: number;

  @IsNotEmpty({ message: '商品ID不能为空~' })
  @IsInt({ message: '商品ID必须是数字' })
  count: number;
}
