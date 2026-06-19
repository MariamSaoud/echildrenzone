import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddPlaylist, updatePlaylist } from './dto/playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CONTENT_STATUS_ENUM } from 'src/content/dto/content.dto';

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
  async getPlaylists(page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('Invalid Data!');
    } else {
      const offset = (page - 1) * limit;
      const data = await this.prismaService.playlist.findMany({
        include: { Category: true, ContentAge: true, Channel: true },
        take: limit,
        skip: offset,
      });
      const total = await this.prismaService.playlist.count();
      return {
        data,
        pagination: { totalPages: Math.ceil(total / limit), page, limit },
      };
    }
  }
  async getPlaylistDetails(id: string) {
    const data = await this.prismaService.playlist.findUnique({
      where: { id },
      include: {
        Category: true,
        ContentAge: true,
        Channel: true,
        Content: { where: { status: CONTENT_STATUS_ENUM.APPROVED } },
      },
    });
    return { data };
  }
}
