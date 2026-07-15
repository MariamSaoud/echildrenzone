import { BadRequestException, Module } from '@nestjs/common';
import { MinioProvider } from './storage.provider';
import { MulterModule } from '@nestjs/platform-express';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  controllers: [StorageController],
  providers: [MinioProvider, StorageService],
  exports: [MinioProvider, StorageService],
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
export class StorageModule {}
