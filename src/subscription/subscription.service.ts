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
    const creatorData = await this.userBalance.findUserBalanceChannel(
      channelId,
      'SUBSCRIBE',
    );
    try {
      await this.prismaService.subscription.delete({
        where: { childId_channelId: { channelId, childId } },
      });
      await this.prismaService.userBalance.update({
        where: {
          creatorId: creatorData.myBalance!.creatorId,
          currency: creatorData.myBalance!.currency,
        },
        data: {
          amount:
            +creatorData.myBalance!.amount -
            +creatorData.reached!.paymentAmount,
        },
      });
      return { message: 'UnSubscribe Successfully!' };
    } catch (error) {
      if (error.code === 'P2025') {
        await this.prismaService.subscription.create({
          data: { childId, channelId },
        });
        await this.prismaService.userBalance.update({
          where: {
            creatorId: creatorData.myBalance!.creatorId,
            currency: creatorData.myBalance!.currency,
          },
          data: {
            amount:
              +creatorData.myBalance!.amount +
              +creatorData.reached!.paymentAmount,
          },
        });
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
