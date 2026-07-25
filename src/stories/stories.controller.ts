import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { StoriesService } from './stories.service';
import {
  AddStories,
  confirmRejectStories,
  UpdateStories,
} from './dto/stories.dto';
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
@ApiExtraModels(AddStories)
@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(AddStories) },
        {
          type: 'object',
          properties: {
            file: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  addStory(@Body() dto: AddStories, @UploadedFile() file: Express.Multer.File) {
    return this.storiesService.addStory(dto, file);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Patch(':id')
  updateStoryDetails(
    @Param('id') id: string,
    @GetUser('id') creatorId: string,
    @Body() dto: UpdateStories,
  ) {
    return this.storiesService.updateStoryDetails(id, creatorId, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Patch(':id/post')
  acceptRejectStory(
    @Param('id') id: string,
    @Body() dto: confirmRejectStories,
  ) {
    return this.storiesService.acceptRejectStory(id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Delete(':id')
  deleteStory(@Param('id') id: string, @GetUser('id') creatorId: string) {
    return this.storiesService.deleteStory(id, creatorId);
  }
  @Get(':id')
  getStory(@Param('id') id: string) {
    return this.storiesService.getStory(id);
  }
  //we need (something like cron job for archiving the stories)
}
