import { ConfigService } from '@nestjs/config';
import { minioToken } from './storage.decorator';
import * as Minio from 'minio';

export const MinioProvider = {
  provide: minioToken,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<Minio.Client> => {
    const minioClient = new Minio.Client({
      endPoint: configService.getOrThrow<string>('MINIO_ENDPOINT'),
      port: +configService.getOrThrow<number>('MINIO_PORT'),
      accessKey: configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
      secretKey: configService.getOrThrow<string>('MINIO_SECRET_KEY'),
      useSSL: false,
    });
    const buckets = [
      'echildrenzonephoto',
      'echildrenzonevideo',
      'echildrenzoneffmpeg',
    ];

    for (const bucket of buckets) {
      const exists = await minioClient.bucketExists(bucket);
      if (!exists) {
        await minioClient.makeBucket(bucket);
        if (bucket === 'echildrenzoneffmpeg') {
          const publicReadPolicy = {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'PublicReadGetObject',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucket}/*`],
              },
            ],
          };
          await minioClient.setBucketPolicy(
            bucket,
            JSON.stringify(publicReadPolicy),
          );
        }
      }
    }
    return minioClient;
  },
};
