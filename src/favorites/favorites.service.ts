import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserBalanceService } from 'src/user-balance/user-balance.service';
import { UserCategoryScoreService } from 'src/user-category-score/user-category-score.service';

@Injectable()
export class FavoritesService {
  private readonly favPoints = 7;
  constructor(
    private prismaService: PrismaService,
    private userBalance: UserBalanceService,
    private userCategoryScore: UserCategoryScoreService,
  ) {}
  async toggleFavorite(childId: string, contentId: string) {
    const category = await this.prismaService.content.findUnique({
      where: { id: contentId },
    });
    if (!category) {
      throw new NotFoundException('Content not found!');
    }
    try {
      await this.prismaService.favorites.delete({
        where: { childId_contentId: { childId, contentId } },
      });
      await this.userBalance.withdrawBalance(contentId, 'ADDTOFAV');
      await this.userCategoryScore.decrementUserCategoryScore(
        childId,
        category.categoryId,
        this.favPoints,
      );
      return { message: 'Remove From Favorite Successfully!' };
    } catch (error) {
      if (error.code === 'P2025') {
        await this.prismaService.favorites.create({
          data: { childId, contentId },
        });
        await this.userBalance.depositBalance(contentId, 'ADDTOFAV');
        await this.userCategoryScore.upsertUserCategoryScore(
          childId,
          category.categoryId,
          this.favPoints,
        );
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
