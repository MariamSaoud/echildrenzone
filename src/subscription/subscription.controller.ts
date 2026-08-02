import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { SubscriptionService } from './subscription.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post()
  @ApiOperation({
    summary: 'Toggle channel subscription for the logged-in child',
  })
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
  toggleChannelSubscription(
    @GetUser('id') childId: string,
    @Body('channelId') channelId: string,
  ) {
    return this.subscriptionService.toggleChannelSubscription(
      childId,
      channelId,
    );
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Get()
  getSubscribedChannel(@GetUser('id') childId: string) {
    return this.subscriptionService.getSubscribedChannel(childId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.PARENT)
  @Get('parent/:id')
  getSubscribedChildChannel(@Param('id') childId: string) {
    return this.subscriptionService.getSubscribedChannel(childId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.PARENT)
  @Post('parent/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the child account',
    example: 'child-uuid-123',
  })
  toggleChannelChildSubscription(
    @Param('id') childId: string,
    @Body('channelId') channelId: string,
  ) {
    return this.subscriptionService.toggleChannelSubscription(
      childId,
      channelId,
    );
  }
}
