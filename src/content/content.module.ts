import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { StorageModule } from 'src/storage/storage.module';
import { VideosModule } from 'src/videos/videos.module';
import { BullModule } from '@nestjs/bullmq';
import { contentConsumer } from './content.consumer';

@Module({
  controllers: [ContentController],
  providers: [ContentService, contentConsumer],
  imports: [
    StorageModule,
    VideosModule,
    BullModule.registerQueue({
      name: 'content',
    }),
  ],
})
export class ContentModule {}
