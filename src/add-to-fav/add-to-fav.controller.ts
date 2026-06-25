import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AddToFavService } from './add-to-fav.service';
import { GetUser } from 'src/decorators/getUser.decorator';

@Controller('add-to-fav')
export class AddToFavController {
  constructor(private addToFavService: AddToFavService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post()
  toggleFavorite(
    @GetUser('id') childId: string,
    @Param('id') contentId: string,
  ) {
    return this.addToFavService.toggleFavorite(childId, contentId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Get()
  getFavorite(
    @GetUser('id') childId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.addToFavService.getFavForChild(childId, page, limit);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.PARENT)
  @Get('parents/:id')
  getChildFavorite(
    @Param('id') childId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.addToFavService.getFavForChild(childId, page, limit);
  }
}
