import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddComment, UpdateComment } from './dto/comment.dto';
import { UserBalanceService } from 'src/user-balance/user-balance.service';
import { UserCategoryScoreService } from 'src/user-category-score/user-category-score.service';

@Injectable()
export class CommentService {
  private readonly commentPoints = 2;
  constructor(
    private prismaService: PrismaService,
    private userBalance: UserBalanceService,
    private userCategoryScore: UserCategoryScoreService,
  ) {}
  async addComment(id: string, dto: AddComment) {
    const data = await this.prismaService.comment.create({
      data: { ...dto, childId: id },
    });
    await this.userBalance.depositBalance(data.contentId, 'COMMENT');
    const category = await this.prismaService.content.findUnique({
      where: { id: data.contentId },
    });
    if (!category) {
      throw new NotFoundException('Content not found!');
    }
    await this.userCategoryScore.upsertUserCategoryScore(
      id,
      category.categoryId,
      this.commentPoints,
    );
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
    await this.userBalance.withdrawBalance(element.contentId, 'COMMENT');
    const category = await this.prismaService.content.findUnique({
      where: { id: element.contentId },
    });
    if (!category) {
      throw new NotFoundException('Content not found!');
    }
    await this.userCategoryScore.decrementUserCategoryScore(
      childId,
      category.categoryId,
      this.commentPoints,
    );

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
