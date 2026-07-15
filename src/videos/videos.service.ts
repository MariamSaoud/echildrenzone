import { BadRequestException, Injectable } from '@nestjs/common';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs/promises';
import * as fsNormal from 'fs';
import * as Minio from 'minio';
import path from 'path';
import { InjectMinio } from 'src/storage/storage.decorator';
@Injectable()
export class VideosService {
  constructor(@InjectMinio() private readonly minioClient: Minio.Client) {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }
  async convertVideo(video: Express.Multer.File) {
    if (video.mimetype !== 'video/mp4') {
      throw new BadRequestException('Must Be Video!');
    }
    const inputPath = path.join(process.cwd(), 'tmp', video.filename);
    const folderDir = path.join(process.cwd(), 'tmp', `${video.filename}_hls`);
    try {
      // التأكد من وجود مجلد المخرجات أو إنشائه
      const stat = await fs.stat(folderDir).catch(() => null);
      if (!stat) {
        await fs.mkdir(folderDir, { recursive: true }); //without fs/promises we cannot use recursive
      }
      const outputFileName = `${video.filename}.m3u8`;
      const outputPath = path.join(folderDir, outputFileName);
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .toFormat('hls')
          .outputOptions([
            '-hls_time 10', // تقسيم الفيديو إلى مقاطع مدة كل منها 10 ثوانٍ
            '-hls_list_size 0', // الاحتفاظ بجميع المقاطع داخل ملف الـ playlist
            '-hls_playlist_type vod', // <--- مهم جداً لضمان اكتمال ملف الـ m3u8
            '-c:v libx264', // ترميز الفيديو الافتراضي والمستقر
            '-c:a aac', // ترميز الصوت الافتراضي والمستقر
            '-hls_segment_filename',
            path.join(folderDir, 'seg-%d.ts'),
          ])
          .on('end', () => {
            console.log('Finished Successfully!');
            resolve();
          })
          .on('error', (err) => {
            console.log(`An Error Occurred While Converting! ${err}`);
            reject(err);
          })
          .saveToFile(outputPath);
      });
      const files = await fs.readdir(folderDir);

      for (const file of files) {
        const filePath = path.join(folderDir, file);
        const fileStream = fsNormal.createReadStream(filePath);
        const stat = fsNormal.statSync(filePath);
        const contentType = file.endsWith('.m3u8')
          ? 'application/x-mpegURL'
          : file.endsWith('.ts')
            ? 'video/MP2T'
            : 'application/octet-stream';

        const objectName = `${video.filename}/${file}`;
        await this.minioClient.putObject(
          'echildrenzoneffmpeg',
          objectName,
          fileStream,
          stat.size,
          { 'Content-Type': contentType },
        );
      }
      const masterPlaylistPath = `${video.filename}/${outputFileName}`;
      return {
        bucket: 'echildrenzoneffmpeg',
        playlistPath: masterPlaylistPath,
      };
    } catch (error) {
      console.error('Failed to create output folder:', error);
      throw error;
    } finally {
      await fs.rm(inputPath, { force: true }).catch(() => {});
      await fs.rm(folderDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
