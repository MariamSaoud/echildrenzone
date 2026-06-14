import { Module } from '@nestjs/common';
import { ContentTfQuestionsController } from './content-tf-questions.controller';
import { ContentTfQuestionsService } from './content-tf-questions.service';

@Module({
  controllers: [ContentTfQuestionsController],
  providers: [ContentTfQuestionsService]
})
export class ContentTfQuestionsModule {}
