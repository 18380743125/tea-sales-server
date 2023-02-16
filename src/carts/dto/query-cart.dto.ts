import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class QueryCartDto {
  @IsNumberString(null, { message: '页码必须是数字' })
  @IsNotEmpty({ message: '页码不能为空' })
  page: number;

  @IsOptional()
  @IsNumberString(null, { message: 'size必须是数字' })
  size?: 10;
}
