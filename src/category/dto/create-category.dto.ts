import { IsNotEmpty, IsString, Length, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty({ message: '类别名称不能为空~' })
  @IsString({ message: '类别名称必须是字符串~' })
  @MaxLength(20, { message: '类别名称不能超过20个字符串' })
  name: string
}
