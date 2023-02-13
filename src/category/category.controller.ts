import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RetUtils } from '../common/utils/ret.utils';
import { TypeormFilter } from '../common/filters/typeorm.filter';
import { ErrorEnum } from "../common/enum/error.enum";

@Controller('category')
@UseFilters(TypeormFilter)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  // 创建类别
  async create(@Body() dto: CreateCategoryDto) {
    await this.categoryService.create(dto);
    return new RetUtils();
  }

  @Get()
  // 查询全部类别
  async findAll() {
    const result = await this.categoryService.findAll();
    return new RetUtils(200, 'ok', result);
  }

  @Get(':id')
  // 根据 id 查询类别
  async findOne(@Param('id') id: string) {
    const result = await this.categoryService.findOne(+id);
    return new RetUtils(200, 'ok', result);
  }

  @Delete(':id')
  // 根据 id 删除类别
  async remove(@Param('id') id: string) {
    const category = await this.categoryService.findOne(+id)
    if(!category) {
      return new RetUtils(200, ErrorEnum.NO_EXISTS)
    }
    await this.categoryService.remove(category);
    return new RetUtils(200, 'ok');
  }
}
