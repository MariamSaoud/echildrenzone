import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './tmp',
      }),
    }),
  ],
})
export class VideosModule {}
