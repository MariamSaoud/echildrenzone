import { BadRequestException, Injectable } from '@nestjs/common';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs/promises';
import * as fsNormal from 'fs';
import * as Minio from 'minio';
import path from 'path';
import { InjectMinio } from 'src/storage/storage.decorator';
const RESOLUTIONS = [
  {
    name: '480p',
    width: 854,
    height: 480,
    bitrate: '800k',
    maxrate: '856k',
    bufsize: '1200k',
  },
  {
    name: '720p',
    width: 1280,
    height: 720,
    bitrate: '2500k',
    maxrate: '2675k',
    bufsize: '3750k',
  },
  {
    name: '1080p',
    width: 1920,
    height: 1080,
    bitrate: '5000k',
    maxrate: '5350k',
    bufsize: '7500k',
  },
];

@Injectable()
export class VideosService {
  constructor(@InjectMinio() private readonly minioClient: Minio.Client) {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }

  async convertVideo(
    video: Express.Multer.File | { buffer: Buffer; mimetype?: string },
  ) {
    if (video.mimetype !== 'video/mp4') {
      throw new BadRequestException('Must Be Video!');
    }
    const tmpDir = path.join(process.cwd(), 'tmp');
    const safeFileName = `${Date.now()}-video`;
    const inputPath = path.join(tmpDir, `${safeFileName}.mp4`);
    const folderDir = path.join(tmpDir, `${safeFileName}_hls`);

    try {
      await fs.mkdir(folderDir, { recursive: true });
      const videoBuffer = Buffer.isBuffer(video.buffer)
        ? video.buffer
        : Buffer.from((video.buffer as any)?.data || video.buffer);

      await fs.writeFile(inputPath, videoBuffer);
      const conversionPromises = RESOLUTIONS.map(async (res) => {
        const resFolder = path.join(folderDir, res.name);

        await fs.mkdir(resFolder, { recursive: true });
        return await new Promise<void>((resolve, reject) => {
          ffmpeg(inputPath)
            .toFormat('hls')
            .outputOptions([
              `-vf scale=w=${res.width}:h=${res.height}:force_original_aspect_ratio=decrease,pad=${res.width}:${res.height}:(ow-iw)/2:(oh-ih)/2`, // الحفاظ على أبعاد الفيديو الأصلية مع تظليل الباقي
              `-b:v ${res.bitrate}`, //بيحدد الجودة التقريبية أو متوسط حجم البيانات بالثانية
              `-maxrate ${res.maxrate}`, //السقف الأعلى للجودة
              `-bufsize ${res.bufsize}`, //حجم ذاكرة التخزين المؤقت (Buffer)
              '-hls_time 10',
              '-hls_list_size 0',
              '-hls_playlist_type vod', //المشاهد يقدر يقدم ويرجع بالفيديو
              '-c:v libx264',
              '-c:a aac',
              '-b:a 128k', // تحديد جودة الصوت
              '-hls_segment_filename',
              path.join(resFolder, 'seg-%d.ts'),
            ])
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .saveToFile(path.join(resFolder, 'video.m3u8'));
        });
      });

      await Promise.all(conversionPromises);

      let masterContent = '#EXTM3U\n#EXT-X-VERSION:3\n';
      RESOLUTIONS.forEach((res) => {
        const bandwidth = (parseInt(res.bitrate) + 128) * 1020;
        masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${res.width}x${res.height}\n`;
        masterContent += `${res.name}/video.m3u8\n`;
      });

      const masterFileName = 'master.m3u8';
      const masterFilePath = path.join(folderDir, masterFileName);
      await fs.writeFile(masterFilePath, masterContent);

      const uploadFiles = async (dir: string, baseDir: string) => {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const resPath = path.join(dir, entry.name);
          const relativePath = path
            .relative(baseDir, resPath)
            .replace(/\\/g, '/');
          if (entry.isDirectory()) {
            await uploadFiles(resPath, baseDir);
          } else {
            const fileStream = fsNormal.createReadStream(resPath);
            const stat = fsNormal.statSync(resPath);
            const contentType = entry.name.endsWith('.m3u8')
              ? 'application/x-mpegURL'
              : entry.name.endsWith('.ts')
                ? 'video/MP2T'
                : 'application/octet-stream';

            const objectName = `${safeFileName}/${relativePath}`;
            await this.minioClient.putObject(
              'echildrenzoneffmpeg',
              objectName,
              fileStream,
              stat.size,
              { 'Content-Type': contentType },
            );
          }
        }
      };

      await uploadFiles(folderDir, folderDir);

      const masterObjectName = `${safeFileName}/${masterFileName}`; //should be stored in DB
      const masterPlaylistUrl = await this.minioClient.presignedUrl(
        'GET',
        'echildrenzoneffmpeg',
        masterObjectName,
        24 * 60 * 60,
        { 'response-content-disposition': 'inline' },
      );

      return {
        bucket: 'echildrenzoneffmpeg',
        masterObjectName,
        playlistPath: masterPlaylistUrl,
      };
    } catch (error) {
      console.error('Failed to process video:', error);
      throw error;
    } finally {
      await fs.rm(inputPath, { force: true }).catch(() => {});
      await fs.rm(folderDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
