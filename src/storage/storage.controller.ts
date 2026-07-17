import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { Public } from 'src/decorators/jwt.ispublic.decorator';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('minio')
export class StorageController {
  constructor(private storageService: StorageService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Get('bucket')
  bucketList() {
    return this.storageService.bucketList();
  }
  @Public()
  @Get('*name')
  getFile(@Param('name') name: string | string[]) {
    const formattedPath = Array.isArray(name) ? name.join('/') : name;
    return this.storageService.getFile(formattedPath);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile('file') file: Express.Multer.File) {
    return this.storageService.uploadFile(file);
  }
}
