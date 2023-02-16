export enum ErrorEnum {
  SERVER = 'server_error', // 服务器异常
  EXISTS = 'exists', // 已存在
  NO_EXISTS = 'no_exists', // 不存在
  PARAMS = 'params_error', // 请求参数错误
  CAPTCHA_ERROR = 'captcha_error', // 验证码错误
  CAPTCHA_EXPIRES = 'captcha_expires', // 验证码过期
  LOGIN_ERROR = 'name_or_password_error', // 用户名或密码错误
  UNAUTHORIZED = 'unauthorized', // 未授权
  FORBIDDEN = 'forbidden', // 禁止访问
  LOGIN_EXPIRES = 'login_expires', // 登录过期
  NO_ADMIN_AUTH = 'no_admin_auth', // 无管理员权限
  PASSWORD_ERROR = 'password_error', // 密码错误
  FILE_TO_LARGE = 'file_to_large', // 文件太大
  FILE_FORMAT_ERROR = 'file_format_error', // 文件格式错误
  UNDER_STOCK = 'under_stock', // 库存不足
  ADDRESS_NO_EXISTS = 'address_no_exists', //地址不存在
}
