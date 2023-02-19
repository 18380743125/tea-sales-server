import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from '../../configuration';
import { AppConfig, MySQLConfig } from '../enum/config.enum';

const configObj: Record<string, any> = configuration();
const appConfig = configObj.app;
const mysqlConfig = configObj.db['mysql'];

function buildConnectionOptions() {
  const entitiesDir =
    process.env.NODE_ENV === 'test'
      ? [path.join(__dirname, '../../**/*.entity.ts')]
      : [path.join(__dirname, '../../**/*.entity{.js,.ts}')];
  const logFlag = appConfig[AppConfig.LOG_ON];
  const isDevelopment =
    process.env.NODE_ENV && process.env.NODE_ENV === 'development';
  return {
    type: mysqlConfig[MySQLConfig.TYPE],
    host: mysqlConfig[MySQLConfig.HOST],
    port: mysqlConfig[MySQLConfig.PORT],
    username: mysqlConfig[MySQLConfig.USERNAME],
    password: mysqlConfig[MySQLConfig.PASSWORD],
    database: mysqlConfig[MySQLConfig.DATABASE],
    // synchronize: mysqlConfig[MySQLConfig.SYNC],
    synchronize: false,
    entities: entitiesDir,
    // logging: logFlag && isDevelopment,
    logging: ['error'],
    // logging: false,
    retryDelay: 30000,
  } as TypeOrmModuleOptions;
}

export const connectionParams = buildConnectionOptions();

export default new DataSource({
  ...connectionParams,
  migrations: ['../migrations'],
  subscribers: [],
} as DataSourceOptions);
