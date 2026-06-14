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
import { AddQuestion, UpdateQuestion } from './dto/question.dto';
import { ContentTfQuestionsService } from './content-tf-questions.service';

@Controller('content-tf-questions')
export class ContentTfQuestionsController {
  constructor(private contentTfQuestionsService: ContentTfQuestionsService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Post()
  addQuestion(@Body() dto: AddQuestion) {
    return this.contentTfQuestionsService.addQuestion(dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Put(':id')
  updateQuestion(@Param('id') id: string, @Body() dto: UpdateQuestion) {
    return this.contentTfQuestionsService.updateQuestion(id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Delete(':id')
  deleteQuestion(@Param('id') id: string) {
    return this.contentTfQuestionsService.deleteQuestion(id);
  }
  @UseGuards(IsntBlocked)
  @Get(':id')
  getQuestionsForContent(
    @Param('id') contentId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.contentTfQuestionsService.getQuestionsForContent(
      contentId,
      page,
      limit,
    );
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post(':id/answer')
  answerQuestion(@Param('id') id: string, @Body('answer') answer: boolean) {
    return this.contentTfQuestionsService.answerQuestion(id, answer);
  }
}
