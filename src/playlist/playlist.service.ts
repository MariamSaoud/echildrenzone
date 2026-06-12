import { Injectable, NotFoundException } from '@nestjs/common';
import { AddPlaylist, updatePlaylist } from './dto/playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaylistService {
  constructor(private prismaService: PrismaService) {}
  async createPlaylist(dto: AddPlaylist) {
    const contentAgeId = await this.prismaService.contentAge.findUnique({
      where: { id: dto.contentAgeId },
    });
    if (!contentAgeId) {
      throw new NotFoundException('Not Found Data!');
    }
    const categoryId = await this.prismaService.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!categoryId) {
      throw new NotFoundException('Not Found Data!');
    }
    const channelId = await this.prismaService.channel.findUnique({
      where: { id: dto.channelId },
    });
    if (!channelId) {
      throw new NotFoundException('Not Found Data!');
    }
    const data = await this.prismaService.playlist.create({ data: { ...dto } });
    return { data };
  }
  async updatePlaylist(id: string, dto: updatePlaylist) {
    const data = await this.prismaService.playlist.update({
      where: { id },
      data: { ...dto },
    });
    return { data };
  }
  async deletePlaylist(id: string) {
    const element = await this.prismaService.playlist.findUnique({
      where: { id },
    });
    if (!element) {
      throw new NotFoundException('Not Found!');
    }
    await this.prismaService.playlist.delete({ where: { id } });
    return { message: 'Deleted Successfully!' };
  }
}
