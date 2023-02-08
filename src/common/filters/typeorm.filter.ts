import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import * as requestIp from 'request-ip';
import { ErrorEnum } from '../enum/error.enum';

@Catch(TypeORMError)
export class TypeormFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const ENV = process.env.NODE_ENV;

    let code = exception['errno'];
    let message = ErrorEnum.SERVER;
    switch (code) {
      case 1062:
        message = ErrorEnum.EXISTS;
    }

    let responseBody = {
      code,
      message,
      detail: ENV === 'development' ? exception['message'] : '',
      error: ENV === 'development' ? 'sql error' : '服务器错误, 请稍后再试',
      ip: requestIp.getClientIp(req),
    };
    const logger = new Logger();
    logger.error(TypeormFilter.name, responseBody);
    res.status(200).json(responseBody);
  }
}
