import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { ErrorEnum } from '../common/enum/error.enum';
import { Role } from '../role/role.entity';
import { User } from './user.entity';
import { andConditionUtils } from '../common/utils/db.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // 用户注册
  async create(dto: CreateUserDto) {
    // 默认注册普通用户
    if (!dto.roles) {
      dto.roles = ['普通用户'];
    } else {
      dto.roles = dto.roles.map((item) => {
        if (item.name) return item.name;
        else return item;
      });
    }
    dto.roles = await this.roleRepository.find({
      where: { name: In(dto.roles as string[]) },
    });
    // 对密码 hash
    dto.password = await argon2.hash(dto.password);
    return this.userRepository.save(dto as any);
  }

  // 多条件查询用户
  async findAll(dto: QueryUserDto) {
    const { page, size, ...conditionObj } = dto;
    console.log(dto);
    const qb = this.userRepository.createQueryBuilder('user');
    andConditionUtils(qb, conditionObj);
    qb.orderBy('user.createAt', 'DESC');
    qb.skip((page - 1) * size).take(size);
    return qb.getManyAndCount();
  }

  // 根据ID查询用户
  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: { roles: true },
    });
  }

  // 根据ID查询用户
  findOneByName(name: string) {
    return this.userRepository.findOne({
      where: { name },
      relations: { roles: true },
    });
  }

  // 更改用户信息
  async update(id: number, dto: UpdateUserDto) {
    this.userRepository.update(id, dto as User);
    return null;
  }

  // 删除用户
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) return ErrorEnum.NO_EXISTS;
    return this.userRepository.remove(user);
  }

  // 根据 name 验证是否为管理员
  async validateAdmin(name: string) {
    const user = await this.findOneByName(name);
    if (!user) {
      return false;
    }
    return !!user.roles.filter((item) => item.name === '管理员').length;
  }
}
