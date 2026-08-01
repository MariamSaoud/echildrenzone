import { Injectable } from '@nestjs/common';
import { InjectMinio } from './storage.decorator';
import * as Minio from 'minio';
import { uuidv7 } from 'uuidv7';
@Injectable()
export class StorageService {
  protected photosBucketName = 'echildrenzonephoto';
  protected videosBucketName = 'echildrenzonevideo';
  protected ffmpegBucketName = 'echildrenzoneffmpeg';
  constructor(@InjectMinio() private readonly minioService: Minio.Client) {}
  async bucketList() {
    return await this.minioService.listBuckets();
  }
  async getFile(filename: string) {
    let bucketName: string;
    const lowerFilename = filename.toLowerCase();
    if (
      lowerFilename.endsWith('.jpeg') ||
      lowerFilename.endsWith('.png') ||
      lowerFilename.endsWith('.jpg')
    ) {
      bucketName = this.photosBucketName;
    } else if (lowerFilename.endsWith('.m3u8')) {
      bucketName = this.ffmpegBucketName;
    } else {
      bucketName = this.videosBucketName;
    }
    const data = await this.minioService.presignedUrl(
      'GET',
      bucketName,
      filename,
      24 * 60 * 60,
      {
        'response-content-disposition': 'inline',
      },
    );
    return { data };
  }
  async uploadFile(file: Express.Multer.File) {
    try {
      let bucketName;
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
      ) {
        bucketName = this.photosBucketName;
      } else {
        bucketName = this.videosBucketName;
      }
      const filename = `${uuidv7()}-${file.originalname}`;
      const rawData = file?.buffer || file;
      const fileBuffer = Buffer.isBuffer(rawData)
        ? rawData
        : Buffer.from((rawData as any)?.data || rawData);
      await this.minioService.putObject(
        bucketName as string,
        filename,

        fileBuffer,

        file.size,
        { 'Content-Type': file.mimetype },
      );
      return filename;
    } catch (error) {
      throw new Error(`MinIO Upload Failed: ${error.message}`);
    }
  }
}
