import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Role } from '../role/role.entity';
import { User } from './user.entity';
import { Avatar } from './avatar.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Avatar])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
