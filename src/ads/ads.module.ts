import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';
import { VideosModule } from 'src/videos/videos.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [AdsController],
  providers: [AdsService],
  imports: [UserBalanceModule, VideosModule, StorageModule],
})
export class AdsModule {}
