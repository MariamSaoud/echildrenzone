import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { Public } from 'src/decorators/jwt.ispublic.decorator';

@Controller('videos')
export class VideosController {
  constructor(private videosService: VideosService) {}
  @Public()
  @Post('convert')
  @UseInterceptors(FileInterceptor('video'))
  async convertVideo(@UploadedFile('file') video: Express.Multer.File) {
    return this.videosService.convertVideo(video);
  }
}
