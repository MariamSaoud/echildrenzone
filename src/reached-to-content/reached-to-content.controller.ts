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
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ReachedToContentService } from './reached-to-content.service';
import { ReachedToContent, UpdateReachedToContent } from './dto/reached.dto';

@Controller('reached-to-content')
export class ReachedToContentController {
  constructor(private reachedToContentServier: ReachedToContentService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Post()
  createReachedTo(@Body() dto: ReachedToContent) {
    return this.reachedToContentServier.createReachedTo(dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Put(':id')
  updateReachedTo(
    @Param('id') id: string,
    @Body() dto: UpdateReachedToContent,
  ) {
    return this.reachedToContentServier.updateReachedTo(id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteReachedTo(@Param('id') id: string) {
    return this.reachedToContentServier.deleteReachedTo(id);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Get()
  getReachedTo(@Query('page') page: number, @Query('limit') limit: number) {
    return this.reachedToContentServier.getReachedTo(page, limit);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Get(':id')
  getReachedToDetails(@Param('id') id: string) {
    return this.reachedToContentServier.getReachedToDetails(id);
  }
}
