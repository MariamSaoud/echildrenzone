import { Module } from '@nestjs/common';
import { feedCalculatingService } from './feed.cronService';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';

@Module({
  providers: [feedCalculatingService, FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
