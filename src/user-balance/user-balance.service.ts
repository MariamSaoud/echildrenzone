import { ForbiddenException, Injectable } from '@nestjs/common';
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
  async withdrawBalance(contentId: string, type: REACHED_TYPE_ENUM) {
    const creatorData = await this.findUserBalance(contentId, type);
    await this.prismaService.userBalance.update({
      where: {
        creatorId: creatorData.myBalance!.creatorId,
        currency: creatorData.myBalance!.currency,
      },
      data: {
        amount:
          +creatorData.myBalance!.amount - +creatorData.reached!.paymentAmount,
      },
    });
  }
  async depositBalance(contentId: string, type: REACHED_TYPE_ENUM) {
    const creatorData = await this.findUserBalance(contentId, type);
    await this.prismaService.userBalance.update({
      where: {
        creatorId: creatorData.myBalance!.creatorId,
        currency: creatorData.myBalance!.currency,
      },
      data: {
        amount:
          +creatorData.myBalance!.amount + +creatorData.reached!.paymentAmount,
      },
    });
  }
  async withdrawSubscriptionBalance(
    channelId: string,
    type: REACHED_TYPE_ENUM = 'SUBSCRIBE',
  ) {
    const creatorData = await this.findUserBalanceChannel(channelId, type);
    await this.prismaService.userBalance.update({
      where: {
        creatorId: creatorData.myBalance!.creatorId,
        currency: creatorData.myBalance!.currency,
      },
      data: {
        amount:
          +creatorData.myBalance!.amount - +creatorData.reached!.paymentAmount,
      },
    });
  }
  async depositSubscriptionBalance(
    channelId: string,
    type: REACHED_TYPE_ENUM = 'SUBSCRIBE',
  ) {
    const creatorData = await this.findUserBalanceChannel(channelId, type);
    await this.prismaService.userBalance.update({
      where: {
        creatorId: creatorData.myBalance!.creatorId,
        currency: creatorData.myBalance!.currency,
      },
      data: {
        amount:
          +creatorData.myBalance!.amount + +creatorData.reached!.paymentAmount,
      },
    });
  }
  async getCreatorBalance(creatorId: string) {
    return await this.prismaService.userBalance.findMany({
      where: { creatorId },
    });
  }
  async withdrawCreator(id: string, amountWithdrawn: number) {
    const amount = await this.prismaService.userBalance.findUnique({
      where: { id },
      select: { amount: true },
    });
    if (+amount!.amount < amountWithdrawn) {
      throw new ForbiddenException('Not Allowed!');
    } else {
      await this.prismaService.userBalance.update({
        where: {
          id,
        },
        data: {
          amount: +amount!.amount - amountWithdrawn,
        },
      });
    }
    return {
      amountWithdrawn,
      remainingAmount: +amount!.amount - amountWithdrawn,
    };
  }
}
