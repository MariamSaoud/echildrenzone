import { Module } from '@nestjs/common';
import { feedCalculatingService } from './feed.service';

@Module({
  providers: [feedCalculatingService],
})
export class FeedModule {}
