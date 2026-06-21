import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserBalanceService } from 'src/user-balance/user-balance.service';

@Injectable()
export class ReactionService {
  constructor(
    private prismaService: PrismaService,
    private userBalance: UserBalanceService,
  ) {}
  async toggleReaction(childId: string, contentId: string) {
    try {
      await this.prismaService.reaction.delete({
        where: { childId_contentId: { childId, contentId } },
      });
      await this.userBalance.withdrawBalance(contentId, 'REACTION');
      return { message: 'UnBlocked Successfully!' };
    } catch (error) {
      if (error.code === 'P2025') {
        await this.prismaService.reaction.create({
          data: { childId, contentId },
        });
        await this.userBalance.depositBalance(contentId, 'REACTION');
        return { message: 'Blocked Successfully!' };
      } else {
        throw error;
      }
    }
  }
  async getReactionsForChild(childId: string, page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid Data!');
    }
    const offset = (page - 1) * limit;
    const data = await this.prismaService.reaction.findMany({
      where: { childId },
      include: { Content: true },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.reaction.count({
      where: { childId },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
  async getReactionForContent(contentId: string, page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid Data!');
    }
    const offset = (page - 1) * limit;
    const data = await this.prismaService.reaction.findMany({
      where: { contentId },
      include: { Child: true },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.reaction.count({
      where: { contentId },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
}
