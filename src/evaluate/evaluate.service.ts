import { Injectable } from '@nestjs/common';
import { CreateEvaluateDto } from './dto/create-evaluate.dto';
import { UpdateEvaluateDto } from './dto/update-evaluate.dto';

@Injectable()
export class EvaluateService {
  create(createEvaluateDto: CreateEvaluateDto) {
    return 'This action adds a new evaluate';
  }

  findAll() {
    return `This action returns all evaluate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evaluate`;
  }

  update(id: number, updateEvaluateDto: UpdateEvaluateDto) {
    return `This action updates a #${id} evaluate`;
  }

  remove(id: number) {
    return `This action removes a #${id} evaluate`;
  }
}
