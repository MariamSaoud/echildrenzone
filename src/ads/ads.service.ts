import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Ads } from './dto/ads.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CONTENT_STATUS_ENUM } from 'generated/prisma/enums';

@Injectable()
export class AdsService {
  constructor(private prismaService: PrismaService) {}
  async addAds(dto: Ads) {
    const data = await this.prismaService.ads.create({
      data: { ...dto },
      include: { Payment: true },
    });
    return { data };
  }
  async changeAdsStatus(id: string, status: CONTENT_STATUS_ENUM) {
    const data = await this.prismaService.ads.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!data) {
      throw new NotFoundException('Not Found!');
    }
    if (
      (data.status !== CONTENT_STATUS_ENUM.PENDING &&
        (status === CONTENT_STATUS_ENUM.APPROVED ||
          status === CONTENT_STATUS_ENUM.REJECTED)) ||
      data.status == 'ARCHIVED'
    ) {
      throw new BadRequestException('Invalid Data');
    }
    const updatedData = await this.prismaService.ads.update({
      where: { id },
      data: { status },
    });
    return { updatedData };
  }
}
