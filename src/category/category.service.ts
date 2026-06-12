import { BadRequestException, Injectable } from '@nestjs/common';
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
    await this.prismaService.category.delete({ where: { id: categoryId } });
    return { message: 'Deleted Successfully!' };
  }
  async getCategory(
    categoryId: string | undefined,
    page: number | undefined,
    limit: number | undefined,
  ) {
    if (categoryId) {
      const data = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });
      return { data };
    } else {
      if (!limit || !page) {
        throw new BadRequestException('invalid data !');
      } else {
        const offset = (page - 1) * limit;
        const data = await this.prismaService.category.findMany({
          take: limit,
          skip: offset,
        });
        const total = await this.prismaService.category.count();
        return {
          data,
          pagination: { totalPages: Math.ceil(total / limit), page, limit },
        };
      }
    }
  }
}
