import { PartialType } from '@nestjs/mapped-types';
import { CreateGoodDto } from './create-good.dto';
import { IsOptional, Length } from 'class-validator';

export class UpdateGoodDto extends PartialType(CreateGoodDto) {
  @IsOptional()
  @Length(1, 1, { message: '商品状态必须是一个字符~' })
  state: string;
}
