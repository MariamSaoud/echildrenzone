import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { VideosModule } from 'src/videos/videos.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [StoriesController],
  providers: [StoriesService],
  imports: [VideosModule, StorageModule],
})
export class StoriesModule {}
