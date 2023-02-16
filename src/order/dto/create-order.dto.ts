import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsInt({ message: '商品ID必须是数字' })
  @IsNotEmpty({ message: '商品ID不能为空' })
  goodsId: number;

  @IsInt({ message: '数量必须是数字' })
  @IsNotEmpty({ message: '数量不能为空' })
  count: number;

  @IsNumber(null, { message: '金额必须是数字' })
  @IsNotEmpty({ message: '金额不能为空' })
  money: number;
}
