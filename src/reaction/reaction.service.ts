import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddReaction, UpdateReaction } from './dto/reaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReactionService {
  constructor(private prismaService: PrismaService) {}
  async addReaction(id: string, dto: AddReaction) {
    const data = await this.prismaService.reaction.create({
      data: { ...dto, childId: id },
    });
    return { data };
  }
  async changeReaction(childId: string, id: string, dto: UpdateReaction) {
    await this.isMe(id, childId);
    const data = await this.prismaService.reaction.update({
      where: { id },
      data: { ...dto },
    });
    return { data };
  }
  async deleteReaction(childId: string, id: string) {
    await this.isMe(id, childId);
    const element = await this.prismaService.reaction.findUnique({
      where: { id },
    });
    if (!element) {
      throw new NotFoundException('Not Found!');
    }
    await this.prismaService.reaction.delete({ where: { id } });
    return { message: 'Deleted Successfully!' };
  }
  async getReactionsForChild(childId: string, page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid Data!');
    }
    const offset = (page - 1) * limit;
    const data = await this.prismaService.reaction.findMany({
      where: { childId },
      include: { Content: true },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.reaction.count({
      where: { childId },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
  async getReactionForContent(contentId: string, page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid Data!');
    }
    const offset = (page - 1) * limit;
    const data = await this.prismaService.reaction.findMany({
      where: { contentId },
      include: { Child: true },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.reaction.count({
      where: { contentId },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
  private async isMe(reactionId: string, userId: string) {
    const reaction = await this.prismaService.reaction.findUnique({
      where: { id: reactionId },
    });
    if (reaction?.childId !== userId) {
      throw new ForbiddenException('Forbidden!');
    }
  }
}
