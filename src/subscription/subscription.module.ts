import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [UserBalanceModule],
})
export class SubscriptionModule {}
