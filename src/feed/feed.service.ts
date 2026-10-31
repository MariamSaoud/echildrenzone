// feed.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client'; // adjust to your generated path

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  private getAge(birthday: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthday.getDate())
    ) {
      age--;
    }
    return age;
  }

  async getFeed(
    userId: string,
    birthdayDate: Date,
    page: number,
    limit: number,
  ) {
    const age = this.getAge(birthdayDate);

    // content must be visible and match the user's age range
    const baseWhere: Prisma.ContentWhereInput = {
      status: 'APPROVED',
      deletedAt: null,
      archivedAt: null,
      ContentAge: {
        startAge: { lte: age },
        endAge: { gte: age },
        deletedAt: null,
      },
    };

    const scores = await this.prisma.userCategoryScore.findMany({
      where: { userId, categoryScore: { gt: 0 } },
    });

    // no category scores yet: newest content for the user's age
    if (!scores.length) {
      const rows = await this.prisma.content.findMany({
        where: baseWhere,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        skip: (page - 1) * limit,
        take: limit + 1, // +1 to know if there is a next page
      });

      return {
        page,
        limit,
        hasMore: rows.length > limit,
        items: rows.slice(0, limit),
      };
    }

    const total = scores.reduce((sum, c) => sum + c.categoryScore, 0);
    const needed = page * limit;

    // one Prisma query per category, in parallel
    const perCategory = await Promise.all(
      scores.map(async ({ categoryId, categoryScore }) => {
        const weight = categoryScore / total;

        const rows = await this.prisma.content.findMany({
          where: { ...baseWhere, categoryId },
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
          take: needed + 1,
        });

        // rank i+1 -> key = (rank - 0.5) / weight
        return rows.map((row, i) => ({ row, key: (i + 0.5) / weight }));
      }),
    );

    const merged = perCategory
      .flat()
      .sort((a, b) => a.key - b.key || a.row.id.localeCompare(b.row.id));

    const items = merged
      .slice((page - 1) * limit, page * limit)
      .map((m) => m.row);

    return {
      page,
      limit,
      hasMore: merged.length > page * limit,
      items,
    };
  }
}
