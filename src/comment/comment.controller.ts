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
import { CommentService } from './comment.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { Role } from 'src/auth/dto/register.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AddComment, UpdateComment } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post()
  addComment(@GetUser('id') childId: string, @Body() dto: AddComment) {
    return this.commentService.addComment(childId, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Put(':id')
  changeComment(
    @GetUser('id') childId: string,
    @Param('id') id: string,
    @Body() dto: UpdateComment,
  ) {
    return this.commentService.changeComment(childId, id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Delete(':id')
  deleteComment(@GetUser('id') childId: string, @Param('id') id: string) {
    return this.commentService.deleteComment(childId, id);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Get(':id/child')
  getCommentsForChild(
    @GetUser('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.commentService.getCommentsForChild(id, page, limit);
  }
  @Get(':id/content')
  async getCommentsForContent(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.commentService.getCommentsForContent(id, page, limit);
  }
}
