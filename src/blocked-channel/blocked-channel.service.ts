import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlockedChannelService {
  constructor(private prismaService: PrismaService) {}
  async toggleBlockedChannel(childId: string, channelId: string) {
    try {
      const myChannel = await this.prismaService.channel.findUnique({
        where: { id: channelId },
      });
      if (!myChannel) {
        throw new NotFoundException('Not Found!');
      }
      await this.prismaService.blockedChannel.delete({
        where: { childId_channelId: { channelId, childId } },
      });
      return { message: 'UnBlocked Successfully!' };
    } catch (error) {
      if (error.code === 'P2025') {
        await this.prismaService.blockedChannel.create({
          data: { childId, channelId },
        });
        return { message: 'Blocked Successfully!' };
      } else {
        throw error;
      }
    }
  }
}
