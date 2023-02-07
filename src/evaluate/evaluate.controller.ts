import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EvaluateService } from './evaluate.service';
import { CreateEvaluateDto } from './dto/create-evaluate.dto';
import { UpdateEvaluateDto } from './dto/update-evaluate.dto';

@Controller('evaluate')
export class EvaluateController {
  constructor(private readonly evaluateService: EvaluateService) {}

  @Post()
  create(@Body() createEvaluateDto: CreateEvaluateDto) {
    return this.evaluateService.create(createEvaluateDto);
  }

  @Get()
  findAll() {
    return this.evaluateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvaluateDto: UpdateEvaluateDto) {
    return this.evaluateService.update(+id, updateEvaluateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evaluateService.remove(+id);
  }
}
