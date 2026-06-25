import { Module } from '@nestjs/common';
import { BlockedChannelController } from './blocked-channel.controller';
import { BlockedChannelService } from './blocked-channel.service';

@Module({
  controllers: [BlockedChannelController],
  providers: [BlockedChannelService]
})
export class BlockedChannelModule {}
