import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLogisticDto {
  @IsNotEmpty({ message: '订单ID不能为空~' })
  @IsInt({ message: '订单ID必须是数字~' })
  orderId: number;

  @IsNotEmpty({ message: '用户ID不能为空~' })
  @IsInt({ message: '用户ID必须是数字~' })
  userId: number;

  @IsNotEmpty({ message: '运输公司不能为空~' })
  @MaxLength(30, { message: '运输公司不能超过30个字符~' })
  @IsString({ message: '运输公司必须是字符串~' })
  way: string;
}
