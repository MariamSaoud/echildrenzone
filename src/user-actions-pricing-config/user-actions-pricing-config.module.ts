import { Module } from '@nestjs/common';
import { userActionsPricingController } from './user-actions-pricing-config.controller';
import { userActionsPricingService } from './user-actions-pricing-config.service';

@Module({
  controllers: [userActionsPricingController],
  providers: [userActionsPricingService],
})
export class userActionsPricingModule {}
