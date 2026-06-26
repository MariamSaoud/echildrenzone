import { BadRequestException, Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import { MinioProvider } from './minio.provider';
import { MinioService } from './minio.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [MinioController],
  providers: [MinioProvider, MinioService],
  exports: [MinioProvider],
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 25 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'video/mp4',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Only image and videos files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  ],
})
export class MinioModule {}
