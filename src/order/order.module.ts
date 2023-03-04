import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { GoodsModule } from '../goods/goods.module';
import { AddressModule } from '../address/address.module';
import { CartsModule } from "../carts/carts.module";
import { Goods } from "../goods/goods.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Order, Goods]), GoodsModule, AddressModule, CartsModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
