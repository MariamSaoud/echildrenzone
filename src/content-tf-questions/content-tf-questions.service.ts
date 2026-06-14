import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddQuestion, UpdateQuestion } from './dto/question.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContentTfQuestionsService {
  constructor(private prismaService: PrismaService) {}
  async addQuestion(dto: AddQuestion) {
    const data = await this.prismaService.content_TF_Questions.create({
      data: { ...dto },
      include: { Content: true },
    });
    return { data };
  }
  async updateQuestion(id: string, dto: UpdateQuestion) {
    const data = await this.prismaService.content_TF_Questions.update({
      where: { id },
      data: { ...dto },
      include: { Content: true },
    });
    return { data };
  }
  async deleteQuestion(id: string) {
    const element = await this.prismaService.content_TF_Questions.findUnique({
      where: { id },
    });
    if (!element) {
      throw new NotFoundException('Not Found!');
    }
    await this.prismaService.content_TF_Questions.delete({ where: { id } });
    return { message: 'Deleted Successfully!' };
  }
  async getQuestionsForContent(id: string, page: number, limit: number) {
    if (!page || !limit) {
      throw new BadRequestException('Invalid Data!');
    }
    const offset = (page - 1) * limit;
    const data = await this.prismaService.content_TF_Questions.findMany({
      where: { contentId: id },
      include: { Content: true },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.content_TF_Questions.count({
      where: { contentId: id },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
  async answerQuestion(id: string, answer: boolean) {
    const question = await this.prismaService.content_TF_Questions.findUnique({
      where: { id },
    });
    if (question!.answer === answer) {
      return { answer: true };
    }
    return { answer: false };
  }
}
