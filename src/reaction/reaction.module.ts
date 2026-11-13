import { Module } from '@nestjs/common';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';
import { UserCategoryScoreModule } from 'src/user-category-score/user-category-score.module';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService],
  imports: [UserBalanceModule, UserCategoryScoreModule],
})
export class ReactionModule {}
