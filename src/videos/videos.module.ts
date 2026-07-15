import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
  imports: [
    StorageModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './tmp',
      }),
    }),
  ],
})
export class VideosModule {}
