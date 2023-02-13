import { FilesInterceptor } from '@nestjs/platform-express';
import { ConstantEnum } from '../common/enum/constant.enum';
import { HttpException } from '@nestjs/common';

export const goodsFilesInterceptor = FilesInterceptor('imgs', 10, {
  limits: {
    fileSize: ConstantEnum.IMG_MAX_SIZE,
  },
  fileFilter(
    req: any,
    file,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) {
    const mimetype = file.mimetype;
    const accepts = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!accepts.includes(mimetype)) {
      callback(new HttpException({ message: '文件格式错误~' }, 415), false);
      return;
    }
    callback(null, true);
  },
});
