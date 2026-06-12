import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AddPlaylist, updatePlaylist } from './dto/playlist.dto';
import { PlaylistService } from './playlist.service';

@Controller('playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Post()
  createPlaylist(@Body() dto: AddPlaylist) {
    return this.playlistService.createPlaylist(dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Put(':id')
  updatePlaylist(@Param('id') id: string, @Body() dto: updatePlaylist) {
    return this.playlistService.updatePlaylist(id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Delete(':id')
  deletePlaylist(@Param('id') id: string) {
    return this.playlistService.deletePlaylist(id);
  }
  //think about get playlist when we finish content
}
