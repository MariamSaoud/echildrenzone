import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannel, ToggleChannel, UpdateChannel } from './dto/channel.dto';
import { CONTENT_STATUS_ENUM } from 'src/content/dto/content.dto';

@Injectable()
export class ChannelService {
  constructor(private prismaService: PrismaService) {}
  async createChannel(creatorId: string, dto: CreateChannel) {
    const data = await this.prismaService.channel.create({
      data: { ...dto, creatorId },
    });
    return { data };
  }
  async updateChannel(userId: string, channelId: string, dto: UpdateChannel) {
    await this.hasPermission(channelId, userId);
    const data = await this.prismaService.channel.update({
      where: { id: channelId },
      data: { ...dto },
    });
    return { data };
  }
  async toggleChannelActivity(
    userId: string,
    channelId: string,
    dto: ToggleChannel,
  ) {
    await this.hasPermission(channelId, userId);
    const data = await this.prismaService.channel.update({
      where: { id: channelId },
      data: { ...dto },
    });
    return { data };
  }
  async deleteChannel(userId: string, channelId: string) {
    await this.hasPermission(channelId, userId);
    await this.prismaService.channel.delete({ where: { id: channelId } });
    return { message: 'deleted successfully!' };
  }
  async hasPermission(channelId: string, userId: string) {
    const isMine = await this.prismaService.channel.findUnique({
      where: { id: channelId, creatorId: userId },
    });
    if (!isMine) {
      throw new ForbiddenException("Can't Do It!");
    }
  }
  async getChannel(
    id: string | undefined,
    page: number | undefined,
    limit: number | undefined,
  ) {
    if (id) {
      const data = await this.prismaService.channel.findUnique({
        where: { id },
        include: {
          Playlist: { include: { Content: true } },
          Content: { where: { playlistId: null } },
          Stories: true,
          creator: { select: { id: true, fullName: true } },
        },
      });
      return { data };
    } else {
      if (!limit || !page) {
        throw new BadRequestException('Invalid Data!');
      } else {
        const offset = (page - 1) * limit;
        const data = await this.prismaService.channel.findMany({
          include: {
            Playlist: {
              include: {
                Content: { where: { status: CONTENT_STATUS_ENUM.APPROVED } },
              },
            },
            Content: {
              where: { playlistId: null, status: CONTENT_STATUS_ENUM.APPROVED },
            },
            Stories: true,
            creator: { select: { id: true, fullName: true } },
          },
          take: limit,
          skip: offset,
        });
        const total = await this.prismaService.channel.count();
        return {
          data,
          pagination: { totalPages: Math.ceil(total / limit), page, limit },
        };
      }
    }
  }
}
