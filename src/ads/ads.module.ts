import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';
import { VideosModule } from 'src/videos/videos.module';
import { StorageModule } from 'src/storage/storage.module';
import { BullModule } from '@nestjs/bullmq';
import { adsConsumer } from './ads.consumer';

@Module({
  controllers: [AdsController],
  providers: [AdsService, adsConsumer],
  imports: [
    UserBalanceModule,
    VideosModule,
    StorageModule,
    BullModule.registerQueue({
      name: 'ads',
    }),
  ],
})
export class AdsModule {}
