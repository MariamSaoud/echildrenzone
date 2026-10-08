import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class feedCalculatingService implements OnModuleInit {
  private readonly logger = new Logger(feedCalculatingService.name);
  constructor(private readonly prismaService: PrismaService) {}
  async onModuleInit() {
    this.logger.debug('Testing handleCron immediately on startup...');
    await this.handleCron();
  }
  @Cron('0 */30 * * * *')
  async handleCron() {
    this.logger.debug('Called Every 30 Minutes!');
    const userCategories = await this.prismaService.userCategoryScore.findMany({
      select: {
        userId: true,
        categoryId: true,
        categoryScore: true,
      },
    });
    const userTotals = new Map<string, number>();
    for (const item of userCategories) {
      const currentTotal = userTotals.get(item.userId) || 0;
      userTotals.set(item.userId, currentTotal + item.categoryScore);
    }
    const updatePromises = userCategories.map((item) => {
      const totalcategoryScore = userTotals.get(item.userId) || 0;
      const percentage =
        totalcategoryScore > 0
          ? Number(((item.categoryScore / totalcategoryScore) * 100).toFixed(2))
          : 0;

      return this.prismaService.userCategoryScore.update({
        where: {
          userId_categoryId: {
            userId: item.userId,
            categoryId: item.categoryId,
          },
        },
        data: { percentage },
      });
    });
    await this.prismaService.$transaction(updatePromises);
    this.logger.debug('Called Successfully!');
  }
}
