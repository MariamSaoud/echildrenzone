import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { VideosService } from 'src/videos/videos.service';

@Processor('ads')
export class adsConsumer extends WorkerHost {
  constructor(
    private videosService: VideosService,
    private storageService: StorageService,
    private prismaService: PrismaService,
  ) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(job: Job, token?: string): Promise<any> {
    if (job.name === 'uploadFile') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const uploadData = await this.storageService.uploadFile(job.data.file);
        await this.prismaService.ads.update({
          data: { url: uploadData },
          where: { id: job.data.adsId },
        });
        return uploadData;
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else if (job.name === 'convertVideo') {
      try {
        const convertVideo = await this.videosService.convertVideo(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          job.data.file,
        );
        await this.prismaService.ads.update({
          data: { hlsurl: convertVideo.masterObjectName },
          where: { id: job.data.adsId },
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
}
