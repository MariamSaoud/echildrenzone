import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddView, UpdateView } from './dto/views.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ViewsService {
  constructor(private prismaService: PrismaService) {}
  async addView(childId: string, dto: AddView) {
    const data = await this.prismaService.views.create({
      data: { ...dto, childId },
    });
    return { data };
  }
  async updateView(childId: string, id: string, dto: UpdateView) {
    await this.isMe(id, childId);
    const data = await this.prismaService.views.update({
      where: { id },
      data: { ...dto },
    });
    return { data };
  }
  async deleteView(childId: string, id: string) {
    await this.isMe(id, childId);
    const element = await this.prismaService.views.findUnique({
      where: { id },
    });
    if (!element) {
      throw new NotFoundException('Not Found!');
    }
    await this.prismaService.views.delete({ where: { id } });
    return { message: 'Deleted Successfully!' };
  }
  async getView(contentId: string, page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid Data!');
    }
    const offset = (page - 1) * limit;
    const data = await this.prismaService.views.findMany({
      where: { contentId },
      include: { Child: true },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.views.count({
      where: { contentId },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
  private async isMe(viewsId: string, userId: string) {
    const views = await this.prismaService.views.findUnique({
      where: { id: viewsId },
    });
    if (views?.childId !== userId) {
      throw new ForbiddenException('Forbidden!');
    }
  }
}
