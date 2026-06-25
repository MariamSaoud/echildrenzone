import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [UserBalanceModule],
})
export class CommentModule {}
