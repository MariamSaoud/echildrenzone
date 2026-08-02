import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  ChangeContentStatus,
  CreateContent,
  UpdateContent,
} from './dto/content.dto';
import { ContentService } from './content.service';
import { GetUser } from 'src/decorators/getUser.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiExtraModels(CreateContent)
@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CreateContent) },
        {
          type: 'object',
          properties: {
            file: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  createContent(
    @Body() dto: CreateContent,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.contentService.createContent(dto, file);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Put(':id')
  updateContent(
    @GetUser('id') creatorId: string,
    @Param('id') id: string,
    @Body() dto: UpdateContent,
  ) {
    return this.contentService.updateContent(creatorId, id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Delete(':id')
  deleteContent(@GetUser('id') creatorId: string, @Param('id') id: string) {
    return this.contentService.deleteContent(creatorId, id);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Get('/Invisible')
  notApprovedContents(
    @GetUser('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.contentService.getInvisibleContents(id, page, limit);
  }
  @Get(':id')
  getSingleContent(@Param('id') id: string) {
    return this.contentService.getSingleContent(id);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Patch(':id')
  contentStatus(@Param('id') id: string, @Body() dto: ChangeContentStatus) {
    return this.contentService.contentStatus(id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN, Role.CREATOR)
  @Post(':id/archive')
  archiveToggle(@Param('id') contentId: string) {
    return this.contentService.archiveToggle(contentId);
  }
}
