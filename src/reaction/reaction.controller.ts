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
import { AddReaction, UpdateReaction } from './dto/reaction.dto';
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
  addReaction(@GetUser('id') childId: string, @Body() dto: AddReaction) {
    return this.reactionService.addReaction(childId, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Put(':id')
  changeReaction(
    @GetUser('id') childId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReaction,
  ) {
    return this.reactionService.changeReaction(childId, id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Delete(':id')
  deleteReaction(@GetUser('id') childId: string, @Param('id') id: string) {
    return this.reactionService.deleteReaction(childId, id);
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
}
