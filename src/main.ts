import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as session from 'express-session';

import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { AppConfig } from './common/enum/config.enum';
import configuration from './configuration';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const appConfig: Record<string, any> = configuration()['app'];

  app.setGlobalPrefix('/api/v1');

  // 配置 session 中间件
  app.use(
    session({
      secret: appConfig[AppConfig.SESSION_SECRET],
      resave: false,
      saveUninitialized: false,
    }),
  );

  // 使用 winston 日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 全局拦截器
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 全局过滤器
  app.useGlobalFilters(new AllExceptionFilter(new Logger()));

  await app.listen(appConfig[AppConfig.PORT]);
}
bootstrap();
