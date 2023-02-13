import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 创建类别
  create(dto: CreateCategoryDto) {
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  // 查询所有类别
  findAll() {
    return this.categoryRepository.find();
  }

  // 根据 id 查询类别
  async findOne(id: number) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  // 删除类别
  async remove(category: Category) {
    return this.categoryRepository.remove(category);
  }

  // 根据类别名称查类别
  async findByName(name: string) {
    return this.categoryRepository.findOne({ where: { name } });
  }
}
