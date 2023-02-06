import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LogModule } from './log/log.module';
import configuration from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionParams } from './config/orm.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(connectionParams),
    LogModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
