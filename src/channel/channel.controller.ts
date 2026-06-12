import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ChannelService } from './channel.service';
import { CreateChannel, ToggleChannel, UpdateChannel } from './dto/channel.dto';
import { GetUser } from 'src/decorators/getUser.decorator';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Post()
  createChannel(@GetUser('id') id: string, @Body() dto: CreateChannel) {
    return this.channelService.createChannel(id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Put(':id')
  updateChannel(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateChannel,
  ) {
    return this.channelService.updateChannel(userId, id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Patch(':id/toggle')
  toggleChannelActivity(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ToggleChannel,
  ) {
    return this.channelService.toggleChannelActivity(userId, id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Delete(':id')
  deleteChannel(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.channelService.deleteChannel(userId, id);
  }
  // show how can we implement get! when we finish playlist and controller
}
