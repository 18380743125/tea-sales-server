import * as path from 'path';
import { HttpException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { ConstantEnum } from '../enum/constant.enum';

// 图片格式验证
const imgFilter = (
  req: any,
  file,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const mimetype = file.mimetype;
  const accepts = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!accepts.includes(mimetype)) {
    callback(new HttpException({ message: '文件格式错误~' }, 415), false);
    return;
  }
  callback(null, true);
};

// 新增商品, 图片拦截器配置
export const goodsFilesInterceptor = FilesInterceptor('imgs', 10, {
  limits: {
    fileSize: ConstantEnum.IMG_MAX_SIZE,
  },
  fileFilter: imgFilter,
});

// 上传头像, 图片拦截器配置
export const avatarFileInterceptor = FileInterceptor('avatar', {
  storage: diskStorage({
    destination: path.join(__dirname, '../../images/avatar'),
    filename(_, file, cb) {
      const filename = `${uuidv4() + path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: ConstantEnum.IMG_MAX_SIZE,
  },
  fileFilter: imgFilter,
});

// 上传评价图片
export const evaluateFileInterceptor = FilesInterceptor('imgs', 10, {
  storage: diskStorage({
    destination: path.join(__dirname, '../../images/evaluate'),
    filename(_, file, cb) {
      const filename = `${uuidv4() + path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
  ...goodsFilesInterceptor,
});
