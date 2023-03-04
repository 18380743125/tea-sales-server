import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty({ message: '收货人不能为空~' })
  name: string

  @IsNotEmpty({ message: '收货人手机号不能为空~' })
  tel: string

  @IsNotEmpty({ message: '地区不能为空~' })
  @IsString({ message: '地区必须是字符串~' })
  @MaxLength(255, { message: '地区不能超过255个字符' })
  address: string;

  @IsOptional()
  @IsString({ message: '详情地址必须是字符串~' })
  @MaxLength(1, { message: 'default必须是一个字符' })
  isDefault?: string;
}
