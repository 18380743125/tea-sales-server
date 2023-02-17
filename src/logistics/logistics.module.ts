import { Module } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { LogisticsController } from './logistics.controller';
import { OrderModule } from "../order/order.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [OrderModule, UserModule],
  controllers: [LogisticsController],
  providers: [LogisticsService]
})
export class LogisticsModule {}
