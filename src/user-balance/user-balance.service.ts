import { Injectable } from '@nestjs/common';
import { REACHED_TYPE_ENUM } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserBalanceService {
  constructor(private prismaService: PrismaService) {}
  async findUserBalance(contentId: string, type: REACHED_TYPE_ENUM) {
    const reached = await this.prismaService.reachedToContent.findFirst({
      where: { type },
      select: { paymentAmount: true },
    });
    const user = await this.prismaService.content.findUnique({
      where: { id: contentId },
      select: { Channel: { select: { creatorId: true } } },
    });
    const myBalance = await this.prismaService.userBalance.findUnique({
      where: { creatorId: user?.Channel.creatorId },
    });
    return { myBalance, reached };
  }
  async findUserBalanceChannel(channelId: string, type: REACHED_TYPE_ENUM) {
    const reached = await this.prismaService.reachedToContent.findFirst({
      where: { type },
      select: { paymentAmount: true },
    });
    const channel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
      select: { creatorId: true },
    });
    const myBalance = await this.prismaService.userBalance.findUnique({
      where: { creatorId: channel!.creatorId },
    });
    return { myBalance, reached };
  }
}
