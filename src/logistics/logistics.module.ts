import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogisticsService } from './logistics.service';
import { LogisticsController } from './logistics.controller';
import { OrderModule } from '../order/order.module';
import { UserModule } from '../user/user.module';
import { Logistic } from './logistic.entity';

@Module({
  imports: [OrderModule, UserModule, TypeOrmModule.forFeature([Logistic])],
  controllers: [LogisticsController],
  providers: [LogisticsService],
})
export class LogisticsModule {}
