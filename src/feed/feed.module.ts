import { Module } from '@nestjs/common';
import { feedCalculatingService } from './feed.cronService';

@Module({
  providers: [feedCalculatingService],
})
export class FeedModule {}
