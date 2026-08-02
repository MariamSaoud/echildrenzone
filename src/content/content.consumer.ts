import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { VideosService } from 'src/videos/videos.service';
import { WorkerHostProcessor } from 'src/worker-host.process';

@Processor('content')
export class contentConsumer extends WorkerHostProcessor {
  constructor(
    private videosService: VideosService,
    private storageService: StorageService,
    private prismaService: PrismaService,
  ) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(job: Job, token?: string): Promise<any> {
    if (job.name === 'convertVideo') {
      try {
        await job.updateProgress(10);
        const convertVideo = await this.videosService.convertVideo(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          job.data.file,
        );
        await job.updateProgress(75);
        await this.prismaService.content.update({
          data: { hlsurl: convertVideo.masterObjectName },
          where: { id: job.data.contentId },
        });
        await job.updateProgress(100);
        return {
          message: 'Video converted successfully',
          hlsurl: convertVideo.masterObjectName,
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
}
