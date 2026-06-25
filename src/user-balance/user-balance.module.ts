import { Module } from '@nestjs/common';
import { UserBalanceService } from './user-balance.service';
import { UserBalanceController } from './user-balance.controller';

@Module({
  providers: [UserBalanceService],
  exports: [UserBalanceService],
  controllers: [UserBalanceController],
})
export class UserBalanceModule {}
