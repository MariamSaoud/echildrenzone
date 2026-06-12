import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannel, ToggleChannel, UpdateChannel } from './dto/channel.dto';

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
}
