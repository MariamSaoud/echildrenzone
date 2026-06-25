import { Module } from '@nestjs/common';
import { AdsPaymentController } from './ads-payment.controller';
import { AdsPaymentService } from './ads-payment.service';

@Module({
  controllers: [AdsPaymentController],
  providers: [AdsPaymentService]
})
export class AdsPaymentModule {}
