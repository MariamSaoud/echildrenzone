import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserBalanceService } from 'src/user-balance/user-balance.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prismaService: PrismaService,
    private userBalance: UserBalanceService,
  ) {}
  async toggleChannelSubscription(childId: string, channelId: string) {
    try {
      await this.prismaService.subscription.delete({
        where: { childId_channelId: { channelId, childId } },
      });
      await this.userBalance.withdrawSubscriptionBalance(channelId);
      return { message: 'UnSubscribe Successfully!' };
    } catch (error) {
      if (error.code === 'P2025') {
        await this.prismaService.subscription.create({
          data: { childId, channelId },
        });
        await this.userBalance.depositSubscriptionBalance(channelId);
        return { message: 'Subscribe Successfully!' };
      } else {
        throw error;
      }
    }
  }
  async getSubscribedChannel(childId: string) {
    return await this.prismaService.subscription.findMany({
      where: { childId },
    });
  }
}
