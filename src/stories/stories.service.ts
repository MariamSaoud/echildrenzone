import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AddStories,
  confirmRejectStories,
  UpdateStories,
} from './dto/stories.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { VideosService } from 'src/videos/videos.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class StoriesService {
  constructor(
    private prismaService: PrismaService,
    private videosService: VideosService,
    private storageService: StorageService,
  ) {}
  async addStory(dto: AddStories, file: Express.Multer.File) {
    const myStory = await this.prismaService.stories.create({
      data: { ...dto },
    });
    let data;
    const myurl = await this.storageService.uploadFile(file);
    if (file.mimetype === 'video/mp4') {
      const myVideo = await this.videosService.convertVideo(file);
      data = await this.prismaService.stories.update({
        data: { hlsurl: myVideo.masterObjectName, url: myurl },
        where: { id: myStory.id },
      });
      return { data, presignUrl: myVideo.playlistPath };
    } else {
      data = await this.prismaService.stories.update({
        data: { url: myurl },
        where: { id: myStory.id },
      });
      return { data };
    }

    return { data };
  }
  async updateStoryDetails(id: string, creatorId: string, dto: UpdateStories) {
    await this.isMe(id, creatorId);
    const data = await this.prismaService.stories.update({
      where: { id },
      data: { ...dto },
    });
    return { data };
  }
  async acceptRejectStory(id: string, dto: confirmRejectStories) {
    const data = await this.prismaService.stories.update({
      where: { id },
      data: { ...dto },
    });
    return { data };
  }
  async deleteStory(id: string, creatorId: string) {
    await this.isMe(id, creatorId);
    await this.prismaService.stories.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: 'Deleted Successfully!' };
  }

  async getStory(id: string) {
    return await this.prismaService.stories.findUnique({
      where: { id },
      include: {
        content: true,
        Channel: true,
        _count: { select: { reactions: true } },
      },
    });
  }
  private async isMe(id: string, creatorId: string) {
    const storyCreator = await this.prismaService.stories.findUnique({
      where: { id },
      select: { Channel: { select: { creatorId: true } } },
    });
    if (!storyCreator) {
      throw new NotFoundException('Not Found');
    }
    if (storyCreator.Channel.creatorId !== creatorId) {
      throw new ForbiddenException('Forbidden');
    }
  }
}
