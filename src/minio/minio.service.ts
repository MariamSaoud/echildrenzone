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
    const filename = `${uuidv7()}-${file.originalname}`;
    try {
      const objInfo = await this.minioService.putObject(
        this.bucketName,
        filename,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        file.buffer,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        file.size,
        { 'Content-Type': file.mimetype },
      );
      return objInfo;
    } catch (error) {
      throw new Error(`MinIO Upload Failed: ${error.message}`);
    }
  }
}
