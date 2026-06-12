import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { BlockedChannelService } from './blocked-channel.service';
import { GetUser } from 'src/decorators/getUser.decorator';

@Controller('blocked-channel')
export class BlockedChannelController {
  constructor(private blockedChannelService: BlockedChannelService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post()
  toggleBlockedChannel(
    @GetUser('id') childId: string,
    @Body('channelId') channelId: string,
  ) {
    return this.blockedChannelService.toggleBlockedChannel(childId, channelId);
  }
}
