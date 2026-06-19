import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReachedToContent, UpdateReachedToContent } from './dto/reached.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReachedToContentService {
  constructor(private prismaService: PrismaService) {}
  async createReachedTo(dto: ReachedToContent) {
    const data = await this.prismaService.reachedToContent.upsert({
      where: { type_currency: { type: dto.type, currency: dto.currency } },
      update: {},
      create: { ...dto },
    });
    return { data };
  }
  async updateReachedTo(id: string, dto: UpdateReachedToContent) {
    try {
      const data = await this.prismaService.reachedToContent.update({
        where: { id },
        data: { ...dto },
      });
      return { data };
    } catch (error) {
      console.log(error);
    }
  }
  async deleteReachedTo(id: string) {
    const element = await this.prismaService.reachedToContent.findUnique({
      where: { id },
    });
    if (!element) {
      throw new NotFoundException('Not Found!');
    }
    await this.prismaService.reachedToContent.delete({ where: { id } });
    return { message: 'Deleted Successfully!' };
  }
  async getReachedTo(page: number, limit: number) {
    if (!page || !limit) {
      throw new BadRequestException('Invalid Data!');
    } else {
      const offset = (page - 1) * limit;
      const data = await this.prismaService.reachedToContent.findMany({
        take: limit,
        skip: offset,
      });
      const total = await this.prismaService.reachedToContent.count();
      return {
        data,
        pagination: { totalPages: Math.ceil(total / limit), page, limit },
      };
    }
  }

  async getReachedToDetails(id: string) {
    const data = await this.prismaService.reachedToContent.findUnique({
      where: { id },
    });
    return { data };
  }
}
