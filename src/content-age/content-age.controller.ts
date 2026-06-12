import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContentAgeService } from './content-age.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { Role } from 'src/auth/dto/register.dto';
import { AddContentAge, UpdateContentAge } from './dto/contentAge.dto';

@Controller('content-age')
export class ContentAgeController {
  constructor(private contentAgeService: ContentAgeService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Post()
  createCategory(@Body() dto: AddContentAge) {
    return this.contentAgeService.createContentAge(dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Put(':id')
  updateCategory(
    @Param('id') contentAgeId: string,
    @Body() dto: UpdateContentAge,
  ) {
    return this.contentAgeService.updateContentAge(contentAgeId, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteCategory(@Param('id') contentAgeId: string) {
    return this.contentAgeService.deleteContentAge(contentAgeId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN, Role.CREATOR)
  @Get(['', ':id'])
  getCategory(
    @Param('id') contentAgeId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.contentAgeService.getContentAges(contentAgeId, page, limit);
  }
}
