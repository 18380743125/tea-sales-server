import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateRoleDto {
  @MaxLength(32, { message: '角色名称不能超过$constraint1个字符' })
  @IsString({ message: '角色名称必须是字符串' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string
}
