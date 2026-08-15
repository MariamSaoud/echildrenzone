import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduledStoriesService implements OnModuleInit {
  private readonly logger = new Logger(ScheduledStoriesService.name);
  constructor(private readonly prismaService: PrismaService) {}
  async onModuleInit() {
    this.logger.debug('Testing handleCron immediately on startup...');
    await this.handleCron();
  }
  @Cron('0 */30 * * * *')
  async handleCron() {
    this.logger.debug('Called Every 30 Minutes!');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await this.prismaService.stories.updateMany({
      data: { status: 'ARCHIVED' },
      where: {
        status: 'APPROVED',
        updatedAt: {
          lte: twentyFourHoursAgo,
        },
      },
    });

    this.logger.debug('Called Successfully!');
  }
}
