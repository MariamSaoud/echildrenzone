import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { VideosModule } from 'src/videos/videos.module';
import { StorageModule } from 'src/storage/storage.module';
import { BullModule } from '@nestjs/bullmq';
import { storiesConsumer } from './stories.consumer';

@Module({
  controllers: [StoriesController],
  providers: [StoriesService, storiesConsumer],
  imports: [
    VideosModule,
    StorageModule,
    BullModule.registerQueue({
      name: 'stories',
    }),
  ],
})
export class StoriesModule {}
