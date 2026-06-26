import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdsPayment, UpdateAdsPayment } from './dto/adsPayment.dto';

@Injectable()
export class AdsPaymentService {
  constructor(private prismaService: PrismaService) {}
  async createAdsPayment(dto: CreateAdsPayment) {
    const data = await this.prismaService.adsPayment.upsert({
      where: {
        type_amountType: { type: dto.type, amountType: dto.amountType },
      },
      update: {},
      create: { ...dto },
    });
    return { data };
  }
  async updateAdsPayment(id: string, dto: UpdateAdsPayment) {
    const data = await this.prismaService.adsPayment.update({
      where: { id },
      data: { ...dto },
    });
    return { data };
  }
  async getAds(page: number, limit: number) {
    if (!page || !limit) {
      throw new BadRequestException('Invalid Data!');
    } else {
      const offset = (page - 1) * limit;
      const data = await this.prismaService.adsPayment.findMany({
        take: limit,
        skip: offset,
      });
      const total = await this.prismaService.adsPayment.count();
      return {
        data,
        pagination: { totalPages: Math.ceil(total / limit), page, limit },
      };
    }
  }
  async getAdsDetails(id: string) {
    return await this.prismaService.adsPayment.findUnique({ where: { id } });
  }
}
