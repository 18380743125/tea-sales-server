import { IsNotEmpty, IsOptional } from "class-validator";

export class QueryUserDto {
  @IsNotEmpty()
  page: number;

  @IsOptional()
  name?: string

  @IsOptional()
  phone?: string

  @IsOptional()
  size?: number;
}
