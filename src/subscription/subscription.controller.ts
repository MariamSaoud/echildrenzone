import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post()
  toggleChannelSubscription(
    @GetUser('id') childId: string,
    @Body('channelId') channelId: string,
  ) {
    return this.subscriptionService.toggleChannelSubscription(
      childId,
      channelId,
    );
  }
}
