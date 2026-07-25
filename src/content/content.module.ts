import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { StorageModule } from 'src/storage/storage.module';
import { VideosModule } from 'src/videos/videos.module';

@Module({
  controllers: [ContentController],
  providers: [ContentService],
  imports: [StorageModule, VideosModule],
})
export class ContentModule {}
