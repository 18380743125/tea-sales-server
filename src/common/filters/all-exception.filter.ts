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
      error: exception['name'],
      ip: requestIp.getClientIp(req),
    };
    const response = exception['response'];

    switch (code) {
      case 400:
        body.message = ErrorEnum.PARAMS;
        body.error = response['message'];
        break;
    }

    this.logger.error(AllExceptionFilter.name, body);
    res.status(200).json(body);
  }
}
