import { Module } from '@nestjs/common';
import { ReachedToContentController } from './reached-to-content.controller';
import { ReachedToContentService } from './reached-to-content.service';

@Module({
  controllers: [ReachedToContentController],
  providers: [ReachedToContentService],
})
export class ReachedToContentModule {}
