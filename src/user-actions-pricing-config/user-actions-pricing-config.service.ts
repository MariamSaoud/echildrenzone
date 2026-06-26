import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AddUserActionsPricing,
  UpdateUserActionsPricing,
} from './dto/user-actions-pricing-config';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class userActionsPricingService {
  constructor(private prismaService: PrismaService) {}
  async createReachedTo(dto: AddUserActionsPricing) {
    const data = await this.prismaService.userActionsPricing.upsert({
      where: { type_currency: { type: dto.type, currency: dto.currency } },
      update: {},
      create: { ...dto },
    });
    return { data };
  }
  async updateReachedTo(id: string, dto: UpdateUserActionsPricing) {
    try {
      const data = await this.prismaService.userActionsPricing.update({
        where: { id },
        data: { ...dto },
      });
      return { data };
    } catch (error) {
      console.log(error);
    }
  }
  async getReachedTo(page: number, limit: number) {
    if (!page || !limit) {
      throw new BadRequestException('Invalid Data!');
    } else {
      const offset = (page - 1) * limit;
      const data = await this.prismaService.userActionsPricing.findMany({
        take: limit,
        skip: offset,
      });
      const total = await this.prismaService.userActionsPricing.count();
      return {
        data,
        pagination: { totalPages: Math.ceil(total / limit), page, limit },
      };
    }
  }

  async getReachedToDetails(id: string) {
    const data = await this.prismaService.userActionsPricing.findUnique({
      where: { id },
    });
    return { data };
  }
}
