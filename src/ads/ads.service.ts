import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Ads } from './dto/ads.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CONTENT_STATUS_ENUM } from 'generated/prisma/enums';
import { UserBalanceService } from 'src/user-balance/user-balance.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class AdsService {
  constructor(
    private prismaService: PrismaService,
    private userBalance: UserBalanceService,
    private storageService: StorageService,
    @InjectQueue('ads') private adsQueue: Queue,
  ) {}
  async addAds(dto: Ads, file: Express.Multer.File) {
    const myAds = await this.prismaService.ads.create({
      data: { ...dto },
      include: { Payment: true },
    });
    const uploadData = await this.storageService.uploadFile(file);
    const data = await this.prismaService.ads.update({
      data: { url: uploadData },
      where: { id: myAds.id },
    });
    if (file.mimetype === 'video/mp4') {
      await this.adsQueue.add(
        'convertVideo',
        {
          file,
          adsId: myAds.id,
        },
        {
          removeOnComplete: true,
          removeOnFail: { count: 100, age: 86400 },
          attempts: 7,
        },
      );
    }
    return { data };
  }
  async changeAdsStatus(id: string, status: CONTENT_STATUS_ENUM) {
    const data = await this.prismaService.ads.findUnique({
      where: { id },
      select: {
        status: true,
        Payment: true,
        Channel: { select: { creatorId: true } },
      },
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
    if (status === CONTENT_STATUS_ENUM.APPROVED) {
      await this.userBalance.withdrawCreator(
        data.Channel.creatorId,
        +data.Payment.amountType,
      );
    }
    return { updatedData };
  }
}
