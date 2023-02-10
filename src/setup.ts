import { Logger, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as MysqlSession from 'express-mysql-session';
import * as mysql from 'mysql2/promise';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { AppConfig, MySQLConfig } from './common/enum/config.enum';
import configuration from './configuration';

export default function (app) {
  const appConfig: Record<string, any> = configuration()['app'];
  const mysqlConfig: Record<string, any> = configuration()['db']['mysql'];

  // 使用 winston 日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 全局拦截器
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 全局过滤器
  app.useGlobalFilters(new AllExceptionFilter(new Logger()));

  // cors
  app.enableCors((req, cb) => {
    const origin = req.get('origin');
    cb(null, {
      credentials: true,
      origin,
    });
  });

  // 数据库链接对象
  const conn = mysql.createPool({
    host: mysqlConfig[MySQLConfig.HOST],
    port: mysqlConfig[MySQLConfig.PORT],
    user: mysqlConfig[MySQLConfig.USERNAME],
    password: mysqlConfig[MySQLConfig.PASSWORD],
    database: mysqlConfig[MySQLConfig.DATABASE],
  });
  const SessionStore = MysqlSession(session);
  const sessionStore = new SessionStore(
    {
      clearExpired: true,
      checkExpirationInterval: 1000 * 60 * 5, // 检查 session 过期的时间间隔为 15 分钟
      expiration: 86400000 * 7, // 最大会话时间为 7 天
      endConnectionOnClose: true,
    },
    conn,
  );
  // 配置 session 中间件
  app.use(
    session({
      secret: appConfig[AppConfig.SESSION_SECRET],
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 30,
      },
      store: sessionStore,
    }),
  );

  // 配置 cookie 中间件
  app.use(cookieParser(appConfig[AppConfig.SESSION_SECRET]))
}
