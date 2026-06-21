import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserBalanceService } from 'src/user-balance/user-balance.service';

@Injectable()
export class AddToFavService {
  constructor(
    private prismaService: PrismaService,
    private userBalance: UserBalanceService,
  ) {}
  async toggleFavorite(childId: string, contentId: string) {
    const creatorData = await this.userBalance.findUserBalance(
      contentId,
      'ADDTOFAV',
    );
    try {
      await this.prismaService.favorites.delete({
        where: { childId_contentId: { childId, contentId } },
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
      return { message: 'Remove From Favorite Successfully!' };
    } catch (error) {
      if (error.code === 'P2025') {
        await this.prismaService.favorites.create({
          data: { childId, contentId },
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
        return { message: 'Add To Favorite Successfully!' };
      } else {
        throw error;
      }
    }
  }
  async getFavForChild(childId: string, page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid Data!');
    }
    const offset = (page - 1) * limit;

    const data = await this.prismaService.favorites.findMany({
      where: { childId },
      include: { Content: true },
      take: limit,
      skip: offset,
    });

    const total = await this.prismaService.favorites.count({
      where: { childId },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
}
