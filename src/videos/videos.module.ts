import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  providers: [VideosService],
  exports: [VideosService],
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
