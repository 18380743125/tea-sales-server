import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { RetUtils } from '../common/utils/ret.utils';
import { JwtGuard } from '../common/guards/jwt.guard';
import { UserService } from '../user/user.service';
import { ErrorEnum } from '../common/enum/error.enum';
import { Serialize } from '../common/decorators/serialize.decorator';
import { Address } from './address.entity';

@Controller('address')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  // 新建地址
  async create(@Req() req, @Body() dto: CreateAddressDto) {
    const { userId } = req.user;
    const user = await this.userService.findOne(userId);

    // 当前新建是默认地址
    if (typeof dto.default !== 'undefined' && dto.default === '1') {
      await this._changeDefault(userId);
    }

    await this.addressService.create(dto, user);
    return new RetUtils();
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  // 更改地址信息
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    const { userId } = req.user;
    const flag = await this._isCanOperation(+id, userId);
    if (!flag) return new RetUtils(200, ErrorEnum.FORBIDDEN);

    if (typeof dto.default !== 'undefined' && dto.default === '1') {
      await this._changeDefault(userId);
    }

    await this.addressService.update(+id, dto);
    return new RetUtils();
  }

  @Get()
  @UseGuards(JwtGuard)
  @Serialize(Address)
  // 查询所有地址
  async findAll(@Req() req) {
    const user = req.user;
    const addresses = await this.addressService.findAll(user.userId);
    return new RetUtils(200, 'ok', addresses);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @Serialize(Address)
  // 根据 id 查询地址信息
  async findOne(@Param('id') id: string) {
    const address = await this.addressService.findOne(+id);
    return new RetUtils(200, 'ok', address);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  // 删除地址信息
  async remove(@Req() req, @Param('id', ParseIntPipe) id: string) {
    const flag = await this._isCanOperation(+id, req.user.userId);
    if (!flag) return new RetUtils(200, ErrorEnum.FORBIDDEN);

    await this.addressService.remove(+id);
    return new RetUtils();
  }

  // 将当前用户默认地址改为非默认地址
  async _changeDefault(userId) {
    const address = await this.addressService.findDefault(userId);
    if (!address) return;
    address.default = '0';
    address && (await this.addressService.update(address.id, address));
  }

  // 当前用户是否可以操作
  async _isCanOperation(id: number, userId: number) {
    const address = await this.addressService.findOne(+id);
    // 地址不存在
    if (!address) return false;
    // 违规操作
    return address.user.id === userId;
  }
}
