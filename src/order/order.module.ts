import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { GoodsModule } from '../goods/goods.module';
import { AddressModule } from "../address/address.module";

@Module({
  imports: [TypeOrmModule.forFeature([Order]), GoodsModule, AddressModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
