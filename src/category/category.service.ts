import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddCategory, updateCategory } from './dto/category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}
  async createCategory(dto: AddCategory) {
    const data = await this.prismaService.category.upsert({
      where: {
        type_specificType: { type: dto.type, specificType: dto.specificType },
      },
      update: {},
      create: { ...dto },
    });
    return { data };
  }
  async updateCategory(categoryId: string, dto: updateCategory) {
    const data = await this.prismaService.category.update({
      where: { id: categoryId },
      data: { ...dto },
    });
    return { data };
  }
  async deleteCategory(categoryId: string) {
    await this.prismaService.category.update({
      where: { id: categoryId },
      data: { deletedAt: new Date() },
    });
    return { message: 'Deleted Successfully!' };
  }
  async getCategory(page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid data !');
    } else {
      const offset = (page - 1) * limit;
      const data = await this.prismaService.category.findMany({
        take: limit,
        skip: offset,
        where: { deletedAt: null, archivedAt: null },
      });
      const total = await this.prismaService.category.count({
        where: { deletedAt: null, archivedAt: { not: null } },
      });
      return {
        data,
        pagination: { totalPages: Math.ceil(total / limit), page, limit },
      };
    }
  }
  async getCategoryDetails(id: string) {
    const data = await this.prismaService.category.findUnique({
      where: { id },
    });
    return { data };
  }
  async archiveToggle(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      select: { archivedAt: true },
    });
    if (!category) {
      throw new NotFoundException('Not Found!');
    }
    if (!category.archivedAt) {
      await this.prismaService.category.update({
        where: { id },
        data: { archivedAt: new Date() },
      });
    } else {
      await this.prismaService.category.update({
        where: { id },
        data: { archivedAt: null },
      });
    }
  }
  async getArchivedCategory(page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid data !');
    } else {
      const offset = (page - 1) * limit;
      const data = await this.prismaService.category.findMany({
        take: limit,
        skip: offset,
        where: { deletedAt: null, archivedAt: { not: null } },
      });
      const total = await this.prismaService.category.count({
        where: { deletedAt: null, archivedAt: { not: null } },
      });
      return {
        data,
        pagination: { totalPages: Math.ceil(total / limit), page, limit },
      };
    }
  }
}
