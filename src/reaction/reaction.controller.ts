import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { GetUser } from 'src/decorators/getUser.decorator';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';

@Controller('reaction')
export class ReactionController {
  constructor(private reactionService: ReactionService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post()
  toggleReaction(
    @GetUser('id') childId: string,
    @Body('contentId') contentId: string,
  ) {
    return this.reactionService.toggleReaction(childId, contentId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Get(':id/child')
  getReactionsForChild(
    @GetUser('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.reactionService.getReactionsForChild(id, page, limit);
  }
  @Get(':id/content')
  async getReactionForContent(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.reactionService.getReactionForContent(id, page, limit);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Get('parent/:id')
  getChildReactions(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.reactionService.getReactionsForChild(id, page, limit);
  }
}
