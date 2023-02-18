import { Module } from '@nestjs/common';
import { EvaluateService } from './evaluate.service';
import { EvaluateController } from './evaluate.controller';
import { GoodsModule } from '../goods/goods.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluate } from './evaluate.entity';
import { EvaluateImg } from "./evaluate-img.entity";
import { OrderModule } from "../order/order.module";

@Module({
  imports: [OrderModule, UserModule, TypeOrmModule.forFeature([Evaluate, EvaluateImg])],
  controllers: [EvaluateController],
  providers: [EvaluateService],
})
export class EvaluateModule {}
