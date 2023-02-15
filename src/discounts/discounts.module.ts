import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './discount.entity';
import { GoodsModule } from "../goods/goods.module";

@Module({
  imports: [GoodsModule, TypeOrmModule.forFeature([Discount])],
  controllers: [DiscountsController],
  providers: [DiscountsService],
})
export class DiscountsModule {}
