import { Injectable } from '@nestjs/common';
import { InjectMinio } from './minio.decorator';
import * as Minio from 'minio';
import { uuidv7 } from 'uuidv7';
@Injectable()
export class MinioService {
  protected photosBucketName = 'echildrenzonephoto';
  protected videosBucketName = 'echildrenzonevideo';
  constructor(@InjectMinio() private readonly minioService: Minio.Client) {}
  async bucketList() {
    return await this.minioService.listBuckets();
  }
  async getFile(filename: string) {
    let bucketName;
    const lowerFilename = filename.toLowerCase();
    if (
      lowerFilename.endsWith('.jpeg') ||
      lowerFilename.endsWith('.png') ||
      lowerFilename.endsWith('.jpg')
    ) {
      bucketName = this.photosBucketName;
    } else {
      bucketName = this.videosBucketName;
    }
    const data = await this.minioService.presignedUrl(
      'GET',
      bucketName as string,
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

      const objInfo = await this.minioService.putObject(
        bucketName as string,
        filename,

        file.buffer,

        file.size,
        { 'Content-Type': file.mimetype },
      );
      return objInfo;
    } catch (error) {
      throw new Error(`MinIO Upload Failed: ${error.message}`);
    }
  }
}
