export enum ErrorEnum {
  SERVER = 'server_error', // 服务器异常
  EXISTS = 'exists', // 已存在
  NO_EXISTS = 'no_exists', // 不存在
  PARAMS = 'params_error', // 请求参数错误
  CAPTCHA_ERROR = 'captcha_error', // 验证码错误
  CAPTCHA_EXPIRES = 'captcha_expires',
  LOGIN_ERROR = 'name_or_password_error'
}
