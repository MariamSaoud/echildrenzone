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
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('reaction')
export class ReactionController {
  constructor(private reactionService: ReactionService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        channelId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
          description: 'The ID of the content to react',
        },
      },
      required: ['contentId'],
    },
  })
  toggleReaction(
    @GetUser('id') childId: string,
    @Body('contentId') contentId: string,
  ) {
    return this.reactionService.toggleReaction(childId, contentId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Get(':id/child')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the child account',
    example: 'child-uuid-123',
  })
  getReactionsForChild(
    @GetUser('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.reactionService.getReactionsForChild(id, page, limit);
  }
  @Get(':id/content')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the child account',
    example: 'content-uuid-123',
  })
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
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the child account',
    example: 'reaction-uuid-123',
  })
  getChildReactions(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.reactionService.getReactionsForChild(id, page, limit);
  }
}
