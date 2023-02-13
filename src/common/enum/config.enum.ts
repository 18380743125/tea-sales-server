export enum MySQLConfig {
  TYPE = 'type',
  HOST = '127.0.0.1',
  PORT = 'port',
  DATABASE = 'database',
  USERNAME = 'username',
  PASSWORD = 'password',
  SYNC = 'sync',
}

export enum AppConfig {
  HOST = 'host',
  PORT = 'port',
  LOG_ON = 'log_on',
  SESSION_SECRET = 'session_secret',
  TOKEN_EXPIRES = 'token_expires',
  REFRESH_TOKEN_EXPIRES = 'refresh_token_expires',
}

export enum FileConfig {
  GOODS_IMG_PATH = '/images/goods/', // 商品图片路径
}
