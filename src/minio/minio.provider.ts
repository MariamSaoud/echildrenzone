import { ConfigService } from '@nestjs/config';
import { minioToken } from './minio.decorator';
import * as Minio from 'minio';

export const MinioProvider = {
  provide: minioToken,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Minio.Client => {
    return new Minio.Client({
      endPoint: configService.getOrThrow<string>('MINIO_ENDPOINT'),
      port: +configService.getOrThrow<number>('MINIO_PORT'),
      accessKey: configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
      secretKey: configService.getOrThrow<string>('MINIO_SECRET_KEY'),
      useSSL: false,
    });
  },
};
