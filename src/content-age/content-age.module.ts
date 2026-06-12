import { Module } from '@nestjs/common';
import { ContentAgeController } from './content-age.controller';
import { ContentAgeService } from './content-age.service';

@Module({
  controllers: [ContentAgeController],
  providers: [ContentAgeService]
})
export class ContentAgeModule {}
