import { Module } from '@nestjs/common';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService],
  imports: [UserBalanceModule],
})
export class ReactionModule {}
