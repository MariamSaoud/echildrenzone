import { Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import { MinioProvider } from './minio.provider';
import { MinioService } from './minio.service';

@Module({
  controllers: [MinioController],
  providers: [MinioProvider, MinioService],
  exports: [MinioProvider],
})
export class MinioModule {}
