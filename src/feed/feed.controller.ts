import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { GetUser } from 'src/decorators/getUser.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}
  @Get()
  getUserFeeds(
    @GetUser('id') id: string,
    @GetUser('birthdayDate') birthdayDate: Date,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.feedService.getFeed(id, birthdayDate, page, limit);
  }
}
