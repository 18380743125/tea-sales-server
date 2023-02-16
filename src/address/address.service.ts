import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { RetUtils } from '../common/utils/ret.utils';
import { ErrorEnum } from '../common/enum/error.enum';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  // 新建地址
  create(dto: CreateAddressDto, user: User) {
    // 还没有地址, 默认新建第一个是默认地址
    if (!this.findDefault(user.id)) dto.default = '1';
    const address = this.addressRepository.create({ ...dto, user });
    return this.addressRepository.save(address);
  }

  // 查询地址
  findAll(userId: number) {
    return this.addressRepository.find({
      where: {
        user: { id: userId },
      },
      relations: { user: true },
    });
  }

  // 根据 ID 查询地址
  findOne(id: number) {
    return this.addressRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  // 查询用户默认地址
  findDefault(userId: number) {
    return this.addressRepository.findOne({
      where: { default: '1', user: { id: userId } },
    });
  }

  // 更改地址
  update(id: number, dto: UpdateAddressDto) {
    return this.addressRepository.update(id, dto);
  }

  // 删除地址
  remove(id: number) {
    return this.addressRepository.delete(id);
  }
}
