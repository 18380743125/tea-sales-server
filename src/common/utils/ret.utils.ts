export interface IHttpRet {
  code: number;
  message: string;
  data: [] | Record<string, any>;
}

export class RetUtils {
  constructor(
    private code = 200,
    private message = 'ok',
    private data: [] | Record<string, any> = [],
  ) {}
}
