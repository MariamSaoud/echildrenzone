import { BadRequestException, Injectable } from '@nestjs/common';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs/promises';
import path from 'path';
@Injectable()
export class VideosService {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }
  async convertVideo(video: Express.Multer.File): Promise<string> {
    if (video.mimetype !== 'video/mp4') {
      throw new BadRequestException('Must Be Video!');
    }
    const inputPath = path.join(process.cwd(), 'tmp', video.filename);
    const folderDir = path.join(process.cwd(), 'tmp', `${video.filename}_hls`);
    try {
      // التأكد من وجود مجلد المخرجات أو إنشائه
      const stat = await fs.stat(folderDir).catch(() => null);
      if (!stat) {
        await fs.mkdir(folderDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create output folder:', error);
      throw error;
    }
    const outputFileName = `${video.filename}.m3u8`;
    const outputPath = path.join(folderDir, outputFileName);
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('hls')
        .outputOptions([
          '-hls_time 10', // تقسيم الفيديو إلى مقاطع مدة كل منها 10 ثوانٍ
          '-hls_list_size 0', // الاحتفاظ بجميع المقاطع داخل ملف الـ playlist
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
    try {
      await fs.unlink(inputPath);
    } catch (unlinkErr) {
      console.error(`Failed to delete input file: ${unlinkErr}`);
    }
    return outputPath;
  }
}
