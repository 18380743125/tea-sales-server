import * as path from 'path';
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
import { Avatar } from './avatar.entity';
import { removeFile } from '../common/utils/fs.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
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
    dto.password = await this.handlePwdHash(dto.password);
    return this.userRepository.save(dto as any);
  }

  // 对密码进行 hash
  async handlePwdHash(password: string) {
    return argon2.hash(password);
  }

  // 多条件查询用户
  async findAll(dto: QueryUserDto) {
    let { page = 1, size = 10, ...conditionObj } = dto;
    typeof page === 'string' && (page = parseInt(page));
    const qb = this.userRepository.createQueryBuilder('user');
    qb.leftJoinAndSelect('user.roles', 'roles');
    qb.leftJoinAndSelect('user.avatar', 'avatar');
    const name = conditionObj.name;
    delete conditionObj.name;
    andConditionUtils(qb, conditionObj);
    qb.andWhere('user.name LIKE :name', { name: `%${name ?? ''}%` });
    qb.orderBy('user.createAt', 'DESC');
    qb.skip((page - 1) * size).take(size);
    return qb.getManyAndCount();
  }

  // 根据ID查询用户
  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: { roles: true, avatar: true },
    });
  }

  // 根据ID查询用户
  findOneByName(name: string) {
    return this.userRepository.findOne({
      where: { name },
      relations: { roles: true, avatar: true },
    });
  }

  // 更改用户信息
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } })
    if(dto.account) user.account += dto.account;
    delete dto.account
    for(const key of Object.keys(dto)) {
      user[key] = dto[key]
    }
    await this.userRepository.update(id, user);
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

  // 更换头像
  async updateAvatar(id: number, avatar: Avatar, filename: string) {
    await this.avatarRepository.update(id, avatar);
    // 删除之前的头像图片
    await removeFile(path.join(__dirname, '../images/avatar', filename));
  }

  // 创建头像
  async createAvatar(avatar: Avatar) {
    return this.avatarRepository.save(avatar);
  }
}
