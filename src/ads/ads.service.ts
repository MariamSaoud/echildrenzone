import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Ads } from './dto/ads.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CONTENT_STATUS_ENUM } from 'generated/prisma/enums';
import { UserBalanceService } from 'src/user-balance/user-balance.service';
import { VideosService } from 'src/videos/videos.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class AdsService {
  constructor(
    private prismaService: PrismaService,
    private userBalance: UserBalanceService,
    private videosService: VideosService,
    private storageService: StorageService,
  ) {}
  async addAds(dto: Ads, file: Express.Multer.File) {
    const myAds = await this.prismaService.ads.create({
      data: { ...dto },
      include: { Payment: true },
    });
    let data;
    const myurl = await this.storageService.uploadFile(file);
    if (file.mimetype === 'video/mp4') {
      const myVideo = await this.videosService.convertVideo(file);
      data = await this.prismaService.content.update({
        data: { hlsurl: myVideo.masterObjectName, url: myurl },
        where: { id: myAds.id },
      });
      return { data, presignUrl: myVideo.playlistPath };
    } else {
      data = await this.prismaService.content.update({
        data: { url: myurl },
        where: { id: myAds.id },
      });
      return { data };
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
