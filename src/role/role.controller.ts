import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RetUtils } from '../common/utils/ret.utils';
import { TypeormFilter } from '../common/filters/typeorm.filter';
import { ErrorEnum } from '../common/enum/error.enum';

@Controller('role')
@UseFilters(TypeormFilter)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() dto: any) {
    await this.roleService.create(dto);
    return new RetUtils();
  }

  @Get()
  async findAll() {
    const result = await this.roleService.findAll();
    return new RetUtils(200, 'ok', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.roleService.findOne(+id);
    return new RetUtils(200, 'ok', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.roleService.remove(+id);
    const flag = result === ErrorEnum.NO_EXISTS;
    return new RetUtils(200, flag ? ErrorEnum.NO_EXISTS : 'ok');
  }
}
