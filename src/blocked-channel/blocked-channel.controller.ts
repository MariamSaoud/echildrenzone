import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { BlockedChannelService } from './blocked-channel.service';
import { GetUser } from 'src/decorators/getUser.decorator';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('blocked-channel')
export class BlockedChannelController {
  constructor(private blockedChannelService: BlockedChannelService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        channelId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'The ID of the channel to subscribe/unsubscribe',
        },
      },
      required: ['channelId'],
    },
  })
  toggleBlockedChannel(
    @GetUser('id') childId: string,
    @Body('channelId') channelId: string,
  ) {
    return this.blockedChannelService.toggleBlockedChannel(childId, channelId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Get()
  getBlockedChannel(@GetUser('id') childId: string) {
    return this.blockedChannelService.getBlockedChannel(childId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.PARENT)
  @Get('parents/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the child id',
    example: 'child-uuid-123',
  })
  getBlockedChildChannel(@Param('id') childId: string) {
    return this.blockedChannelService.getBlockedChannel(childId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.PARENT)
  @Post('parent/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the child id',
    example: 'child-uuid-123',
  })
  toggleBlockedChannelParent(
    @Param('id') childId: string,
    @Body('channelId') channelId: string,
  ) {
    return this.blockedChannelService.toggleBlockedChannel(childId, channelId);
  }
}
