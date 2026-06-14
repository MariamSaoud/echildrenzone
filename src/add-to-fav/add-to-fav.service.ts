import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddToFavService {
  constructor(private prismaService: PrismaService) {}
  async toggleFavorite(childId: string, contentId: string) {
    try {
      await this.prismaService.addToFav.delete({
        where: { childId_contentId: { childId, contentId } },
      });
      return { message: 'Remove From Favorite Successfully!' };
    } catch (error) {
      if (error.code === 'P2025') {
        await this.prismaService.addToFav.create({
          data: { childId, contentId },
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
    const data = await this.prismaService.addToFav.findMany({
      where: { childId },
      include: { Content: true },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.addToFav.count({
      where: { childId },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
}
