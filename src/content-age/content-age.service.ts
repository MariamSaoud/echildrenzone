import { BadRequestException, Injectable } from '@nestjs/common';
import { AddContentAge, UpdateContentAge } from './dto/contentAge.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContentAgeService {
  constructor(private prismaService: PrismaService) {}
  async createContentAge(dto: AddContentAge) {
    const data = await this.prismaService.contentAge.upsert({
      where: {
        startAge_endAge: {
          startAge: dto.startAge,
          endAge: dto.endAge,
        },
      },
      update: {},
      create: { ...dto },
    });
    return { data };
  }
  async updateContentAge(id: string, dto: UpdateContentAge) {
    const data = await this.prismaService.contentAge.update({
      where: { id },
      data: { ...dto },
    });
    return { data };
  }
  async deleteContentAge(id: string) {
    await this.prismaService.contentAge.delete({ where: { id } });
    return { message: 'Deleted Successfully!' };
  }
  async getContentAges(
    id: string | undefined,
    page: number | undefined,
    limit: number | undefined,
  ) {
    if (id) {
      const data = await this.prismaService.contentAge.findUnique({
        where: { id },
      });
      return { data };
    } else {
      if (!limit || !page) {
        throw new BadRequestException('invalid data !');
      } else {
        const offset = (page - 1) * limit;
        const data = await this.prismaService.contentAge.findMany({
          take: limit,
          skip: offset,
        });
        const total = await this.prismaService.contentAge.count();
        return {
          data,
          pagination: { totalPages: Math.ceil(total / limit), page, limit },
        };
      }
    }
  }
}
