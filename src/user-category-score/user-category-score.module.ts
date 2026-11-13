import { Module } from '@nestjs/common';
import { UserCategoryScoreService } from './user-category-score.service';

@Module({
  providers: [UserCategoryScoreService],
  exports: [UserCategoryScoreService],
})
export class UserCategoryScoreModule {}
