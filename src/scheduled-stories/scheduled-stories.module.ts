import { Module } from '@nestjs/common';
import { ScheduledStoriesService } from './scheduled-stories.service';

@Module({
  providers: [ScheduledStoriesService],
})
export class ScheduledStoriesModule {}
