import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: data.code,
          message: data.message,
          data: plainToInstance(this.dto, data.data, {
            excludeExtraneousValues: true,
          }),
        };
      }),
    );
  }
}
