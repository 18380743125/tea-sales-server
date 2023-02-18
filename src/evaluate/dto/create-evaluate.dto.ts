import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEvaluateDto {
  @IsNumberString(null, { message: '订单ID必须是数字' })
  @IsNotEmpty({ message: '订单ID不能为空' })
  orderId: number;

  @IsNumberString(null, { message: 'star必须是数字' })
  @IsNotEmpty({ message: 'star不能为空' })
  star: number;

  @IsString({ message: 'content必须是字符串' })
  @IsNotEmpty({ message: 'content不能为空' })
  @MaxLength(150, { message: 'content不能超过150个字符' })
  content: string;
}
