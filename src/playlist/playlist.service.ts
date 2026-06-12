import { Injectable } from '@nestjs/common';
import { AddPlaylist, updatePlaylist } from './dto/playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaylistService {
  constructor(private prismaService: PrismaService) {}
  async createPlaylist(dto: AddPlaylist) {
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
    await this.prismaService.playlist.delete({ where: { id } });
    return { message: 'Deleted Successfully!' };
  }
}
