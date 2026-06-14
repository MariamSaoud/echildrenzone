import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddComment, UpdateComment } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}
  async addComment(id: string, dto: AddComment) {
    const data = await this.prismaService.comment.create({
      data: { ...dto, childId: id },
    });
    return { data };
  }
  async changeComment(childId: string, id: string, dto: UpdateComment) {
    await this.isMe(id, childId);
    const data = await this.prismaService.comment.update({
      where: { id },
      data: { ...dto },
    });
    return { data };
  }
  async deleteComment(childId: string, id: string) {
    await this.isMe(id, childId);
    const element = await this.prismaService.comment.findUnique({
      where: { id },
    });
    if (!element) {
      throw new NotFoundException('Not Found!');
    }
    await this.prismaService.comment.delete({ where: { id } });
    return { message: 'Deleted Successfully!' };
  }
  async getCommentsForChild(childId: string, page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid Data!');
    }
    const offset = (page - 1) * limit;
    const data = await this.prismaService.comment.findMany({
      where: { childId },
      include: { Content: true },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.comment.count({
      where: { childId },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
  async getCommentsForContent(contentId: string, page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid Data!');
    }
    const offset = (page - 1) * limit;
    const data = await this.prismaService.comment.findMany({
      where: { contentId },
      include: { Child: true },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.comment.count({
      where: { contentId },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
  private async isMe(commentId: string, userId: string) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id: commentId },
    });
    if (comment?.childId !== userId) {
      throw new ForbiddenException('Forbidden!');
    }
  }
}
