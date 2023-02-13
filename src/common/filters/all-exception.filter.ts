import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';

import * as requestIp from 'request-ip';
import { ErrorEnum } from '../enum/error.enum';
import { ConstantEnum } from '../enum/constant.enum';

@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const code =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let body = {
      code,
      message: ErrorEnum.SERVER,
      error: exception['error'],
      reason: exception['message'],
      ip: requestIp.getClientIp(req),
    };
    const response = exception['response'];
    switch (code) {
      case 400:
        body.message = ErrorEnum.PARAMS;
        body.reason = response['message'];
        break;
      case 401:
        body.message = ErrorEnum.UNAUTHORIZED;
        break;
      case 403:
        body.message = ErrorEnum.FORBIDDEN;
        break;
      case 413:
        body.message = ErrorEnum.FILE_TO_LARGE;
        break;
      case 415:
        body.message = ErrorEnum.FILE_FORMAT_ERROR;
        break;
      case ConstantEnum.LOGIN_EXPIRES_STATUS:
        body.message = ErrorEnum.LOGIN_EXPIRES;
    }

    this.logger.error(AllExceptionFilter.name, body);
    res.status(200).json(body);
  }
}
