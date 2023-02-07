import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from './configuration';
import { connectionParams } from './common/config/orm.config';
import { LogModule } from './log/log.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GoodsModule } from './goods/goods.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { CartsModule } from './carts/carts.module';
import { AddressModule } from './address/address.module';
import { EvaluateModule } from './evaluate/evaluate.module';
import { DiscountsModule } from './discounts/discounts.module';
import { LogisticsModule } from './logistics/logistics.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(connectionParams),
    LogModule,
    MenuModule,
    RoleModule,
    UserModule,
    AuthModule,
    GoodsModule,
    CategoryModule,
    OrderModule,
    CartsModule,
    AddressModule,
    EvaluateModule,
    DiscountsModule,
    LogisticsModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
