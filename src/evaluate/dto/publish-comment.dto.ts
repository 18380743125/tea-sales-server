import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class PublishCommentDto {
  @IsInt({ message: '评价ID必须是数字' })
  @IsNotEmpty({ message: '评价ID不能为空' })
  evaluateId: number;

  @IsString({ message: '评论内容必须是字符串' })
  @MaxLength(150, { message: '评论内容不能超过150个字符' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  content: string;

  @IsOptional()
  @IsInt({ message: '父评论ID必须是数字' })
  parentId: number;
}
