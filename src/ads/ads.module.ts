import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';

@Module({
  controllers: [AdsController],
  providers: [AdsService],
  imports: [UserBalanceModule],
})
export class AdsModule {}
