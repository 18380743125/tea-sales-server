import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { ErrorEnum } from "../common/enum/error.enum";
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto) {
    const role = this.roleRepository.create(dto);
    return await this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (!role) return ErrorEnum.NO_EXISTS;
    return await this.roleRepository.remove(role);
  }
}
