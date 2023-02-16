import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty({ message: '地区不能为空~' })
  @IsString({ message: '地区必须是字符串~' })
  @MaxLength(128, { message: '地区不能超过128个字符' })
  region: string;

  @IsNotEmpty({ message: '详细地址不能为空~' })
  @IsString({ message: '详情地址必须是字符串~' })
  @MaxLength(160, { message: '详细地址不能超过160个字符' })
  detail: string;

  @IsOptional()
  @IsString({ message: '详情地址必须是字符串~' })
  @MaxLength(1, { message: 'default必须是一个字符' })
  default?: string;
}
