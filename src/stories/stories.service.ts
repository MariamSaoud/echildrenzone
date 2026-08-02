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
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class StoriesService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StorageService,
    @InjectQueue('stories') private storiesQueue: Queue,
  ) {}
  async addStory(dto: AddStories, file: Express.Multer.File) {
    const myStory = await this.prismaService.stories.create({
      data: { ...dto },
    });
    const uploadData = await this.storageService.uploadFile(file);
    const data = await this.prismaService.stories.update({
      data: { url: uploadData },
      where: { id: myStory.id },
    });
    if (file.mimetype === 'video/mp4') {
      await this.storiesQueue.add(
        'convertVideo',
        {
          file,
          storyId: myStory.id,
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
