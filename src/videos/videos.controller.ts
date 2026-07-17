import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { Public } from 'src/decorators/jwt.ispublic.decorator';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('videos')
export class VideosController {
  constructor(private videosService: VideosService) {}
  @Public()
  @Post('convert')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('video'))
  async convertVideo(@UploadedFile('file') video: Express.Multer.File) {
    return this.videosService.convertVideo(video);
  }
}
