import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prismaService: PrismaService) {}
  async toggleChannelSubscription(childId: string, channelId: string) {
    try {
      const myChannel = await this.prismaService.channel.findUnique({
        where: { id: channelId },
      });
      if (!myChannel) {
        throw new NotFoundException('Not Found!');
      }
      await this.prismaService.subscription.delete({
        where: { childId_channelId: { channelId, childId } },
      });
      return { message: 'UnSubscribe Successfully!' };
    } catch (error) {
      if (error.code === 'P2025') {
        await this.prismaService.subscription.create({
          data: { childId, channelId },
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
