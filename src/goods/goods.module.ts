import * as path from 'path';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goods } from './goods.entity';
import { Category } from '../category/category.entity';
import { CategoryModule } from '../category/category.module';
import { GoodsImg } from './goods-img.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Goods, Category, GoodsImg]),
    CategoryModule,
    MulterModule.register({
      storage: diskStorage({
        destination: path.join(__dirname, '../temp'),
        filename(_, file, cb) {
          const filename = `${uuidv4() + path.extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [GoodsController],
  providers: [GoodsService],
  exports: [GoodsService],
})
export class GoodsModule {}
