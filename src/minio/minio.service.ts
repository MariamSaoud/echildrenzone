import { Injectable } from '@nestjs/common';
import { InjectMinio } from './minio.decorator';
import * as Minio from 'minio';
import { uuidv7 } from 'uuidv7';
@Injectable()
export class MinioService {
  protected bucketName = 'echildrenzone';
  constructor(@InjectMinio() private readonly minioService: Minio.Client) {}
  async bucketList() {
    return await this.minioService.listBuckets();
  }
  async getFile(filename: string) {
    const data = await this.minioService.presignedUrl(
      'GET',
      this.bucketName,
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
      let folderName;
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
      ) {
        folderName = 'images';
      } else {
        folderName = 'videos';
      }
      const filename = `${folderName}/${uuidv7()}-${file.originalname}`;

      const objInfo = await this.minioService.putObject(
        this.bucketName,
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
