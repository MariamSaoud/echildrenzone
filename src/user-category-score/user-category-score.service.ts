import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserCategoryScoreService {
  constructor(private prismaService: PrismaService) {}
  async upsertUserCategoryScore(
    userId: string,
    categoryId: string,
    score: number,
  ) {
    await this.prismaService.userCategoryScore.upsert({
      create: { userId, categoryId, categoryScore: score },
      where: { userId_categoryId: { userId, categoryId } },
      update: { categoryScore: { increment: score } },
    });
  }
  async decrementUserCategoryScore(
    userId: string,
    categoryId: string,
    score: number,
  ) {
    await this.prismaService.userCategoryScore.update({
      where: { userId_categoryId: { userId, categoryId } },
      data: { categoryScore: { decrement: score } },
    });
  }
}
