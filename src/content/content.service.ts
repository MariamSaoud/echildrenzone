import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChangeContentStatus,
  CONTENT_STATUS_ENUM,
  CreateContent,
  UpdateContent,
} from './dto/content.dto';
@Injectable()
export class ContentService {
  constructor(private prismaService: PrismaService) {}
  async createContent(dto: CreateContent) {
    await this.findElements(
      dto.channelId,
      dto.categoryId,
      dto.contentAgeId,
      dto.playlistId,
    );
    const data = await this.prismaService.content.create({ data: { ...dto } });
    return { data };
  }
  async updateContent(creatorId: string, id: string, dto: UpdateContent) {
    await this.IsCreator(id, creatorId);
    const data = await this.prismaService.content.update({
      where: { id },
      data: { ...dto },
    });
    return { data };
  }
  async deleteContent(creatorId: string, id: string) {
    await this.IsCreator(id, creatorId);
    await this.prismaService.content.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Deleted Successfully!' };
  }
  private async findElements(
    channelId: string,
    categoryId: string,
    contentAgeId: string,
    playlistId?: string,
  ) {
    const myChannel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
    });
    const myCategory = await this.prismaService.category.findUnique({
      where: { id: categoryId },
    });
    const myContentAge = await this.prismaService.contentAge.findUnique({
      where: { id: contentAgeId },
    });
    if (playlistId) {
      const myPlaylist = await this.prismaService.playlist.findUnique({
        where: { id: playlistId },
      });
      if (!myChannel || !myCategory || !myContentAge || !myPlaylist) {
        throw new NotFoundException('Not Found!');
      }
    } else {
      if (!myChannel || !myCategory || !myContentAge) {
        throw new NotFoundException('Not Found!');
      }
    }
  }
  async getSingleContent(id: string) {
    return await this.prismaService.content.findUnique({
      where: { id },
      include: {
        Category: true,
        Channel: true,
        Playlist: true,
        ContentAge: true,
        Content_TF_Questions: true,
        _count: {
          select: {
            Reactions: true,
            Comments: true,
            Views: true,
          },
        },
      },
    });
  }
  async contentStatus(id: string, dto: ChangeContentStatus) {
    const data = await this.prismaService.content.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!data) {
      throw new NotFoundException('Not Found!');
    }
    if (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      (data.status !== CONTENT_STATUS_ENUM.PENDING &&
        (dto.status === CONTENT_STATUS_ENUM.APPROVED ||
          dto.status === CONTENT_STATUS_ENUM.REJECTED)) ||
      data.status == 'ARCHIVED'
    ) {
      throw new BadRequestException('Invalid Data');
    }
    if (dto.status === CONTENT_STATUS_ENUM.REJECTED) {
      if (!dto.rejectedReason) {
        throw new BadRequestException('Invalid Data');
      }
    }
    await this.prismaService.content.update({
      where: { id },
      data: { ...dto },
    });
    return { message: `Successfully Status Changed To ${dto.status}` };
  }

  async getInvisibleContents(id: string, page: number, limit: number) {
    if (!page || !limit) {
      throw new BadGatewayException('Invalid Data!');
    }
    const offset = (page - 1) * limit;
    const data = await this.prismaService.content.findMany({
      where: {
        status: { in: ['ARCHIVED', 'REJECTED'] },
        Channel: { creatorId: id },
      },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.content.count({
      where: {
        status: { in: ['ARCHIVED', 'REJECTED'] },
        Channel: { creatorId: id },
      },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
  private async IsCreator(contentId: string, userId: string) {
    const data = await this.prismaService.content.findUnique({
      where: { id: contentId },
      select: { Channel: { select: { creatorId: true } } },
    });
    if (data?.Channel.creatorId !== userId) {
      throw new ForbiddenException('Not Allowed!');
    }
  }
  async archiveToggle(id: string) {
    const content = await this.prismaService.content.findUnique({
      where: { id },
      select: { archivedAt: true },
    });
    if (!content) {
      throw new NotFoundException('Not Found!');
    }
    if (!content.archivedAt) {
      await this.prismaService.content.update({
        where: { id },
        data: { archivedAt: new Date(), status: 'ARCHIVED' },
      });
    } else {
      await this.prismaService.content.update({
        where: { id },
        data: { archivedAt: null, status: 'APPROVED' },
      });
    }
  }
}
