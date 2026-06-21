import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const element = await this.prismaService.contentAge.findUnique({
      where: { id },
    });
    if (!element) {
      throw new NotFoundException('Not Found!');
    }
    await this.prismaService.contentAge.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Deleted Successfully!' };
  }
  async getContentAges(page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid data !');
    } else {
      const offset = (page - 1) * limit;
      const data = await this.prismaService.contentAge.findMany({
        take: limit,
        skip: offset,
        where: { deletedAt: null },
      });
      const total = await this.prismaService.contentAge.count();
      return {
        data,
        pagination: { totalPages: Math.ceil(total / limit), page, limit },
      };
    }
  }
  async getContentAgeDetails(id: string) {
    const data = await this.prismaService.contentAge.findUnique({
      where: { id },
    });
    return { data };
  }
}
