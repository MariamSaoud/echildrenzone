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
import { GetUser } from 'src/decorators/getUser.decorator';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AddView, UpdateView } from './dto/views.dto';
import { ViewsService } from './views.service';

@Controller('views')
export class ViewsController {
  constructor(private viewsService: ViewsService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post()
  addView(@GetUser('id') childId: string, @Body() dto: AddView) {
    return this.viewsService.addView(childId, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Put(':id')
  updateView(
    @GetUser('id') childId: string,
    @Param('id') id: string,
    @Body() dto: UpdateView,
  ) {
    return this.viewsService.updateView(childId, id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Delete(':id')
  deleteView(@GetUser('id') childId: string, @Param('id') id: string) {
    return this.viewsService.deleteView(childId, id);
  }
  @Get(':id/content')
  getView(
    @Param('id') contentId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.viewsService.getView(contentId, page, limit);
  }
}
