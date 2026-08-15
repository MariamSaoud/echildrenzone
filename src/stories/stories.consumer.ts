import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/storage/storage.service';
import { VideosService } from 'src/videos/videos.service';
import { WorkerHostProcessor } from 'src/worker-host.process';
import * as Minio from 'minio';
import { InjectMinio } from 'src/storage/storage.decorator';
@Processor('stories')
export class storiesConsumer extends WorkerHostProcessor {
  constructor(
    private videosService: VideosService,
    private storageService: StorageService,
    private prismaService: PrismaService,
    @InjectMinio() private readonly minioClient: Minio.Client,
  ) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(job: Job, token?: string): Promise<any> {
    if (job.name === 'convertVideo') {
      try {
        await job.updateProgress(10);
        const file = await this.minioClient.getObject(
          'echildrenzonevideo',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          job.data.uploadData,
        );
        const fileBuffer = await this.storageService.streamToBuffer(file);
        await job.updateProgress(20);
        const convertVideo = await this.videosService.convertVideo({
          buffer: fileBuffer,
          mimetype: 'video/mp4',
        });
        await job.updateProgress(75);
        await this.prismaService.stories.update({
          data: { hlsurl: convertVideo.masterObjectName },
          where: { id: job.data.storyId },
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
