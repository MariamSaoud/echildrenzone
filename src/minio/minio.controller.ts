import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MinioService } from './minio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';

@Controller('minio')
export class MinioController {
  constructor(private minioService: MinioService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Get('bucket')
  bucketList() {
    return this.minioService.bucketList();
  }
  @UseGuards(IsntBlocked)
  @Get(':name')
  getFile(@Param('name') name: string) {
    return this.minioService.getFile(name);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile('file') file: Express.Multer.File) {
    return this.minioService.uploadFile(file);
  }
}
