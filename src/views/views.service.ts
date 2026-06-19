import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddView, UpdateView } from './dto/views.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserBalanceService } from 'src/user-balance/user-balance.service';

@Injectable()
export class ViewsService {
  constructor(
    private prismaService: PrismaService,
    private userBalance: UserBalanceService,
  ) {}
  async addView(childId: string, dto: AddView) {
    const creatorData = await this.userBalance.findUserBalance(
      dto.contentId,
      'VIEW',
    );
    const data = await this.prismaService.views.create({
      data: { ...dto, childId },
    });
    await this.prismaService.userBalance.update({
      where: {
        creatorId: creatorData.myBalance!.creatorId,
        currency: creatorData.myBalance!.currency,
      },
      data: {
        amount:
          +creatorData.myBalance!.amount + +creatorData.reached!.paymentAmount,
      },
    });
    return { data };
  }
  async updateView(childId: string, id: string, dto: UpdateView) {
    await this.isMe(id, childId);
    const data = await this.prismaService.views.update({
      where: { id },
      data: { ...dto },
    });
    return { data };
  }
  async deleteView(childId: string, id: string) {
    await this.isMe(id, childId);
    const element = await this.prismaService.views.findUnique({
      where: { id },
    });
    if (!element) {
      throw new NotFoundException('Not Found!');
    }
    const creatorData = await this.userBalance.findUserBalance(
      element.contentId,
      'VIEW',
    );
    await this.prismaService.views.delete({ where: { id } });
    await this.prismaService.userBalance.update({
      where: {
        creatorId: creatorData.myBalance!.creatorId,
        currency: creatorData.myBalance!.currency,
      },
      data: {
        amount:
          +creatorData.myBalance!.amount - +creatorData.reached!.paymentAmount,
      },
    });
    return { message: 'Deleted Successfully!' };
  }
  async getView(contentId: string, page: number, limit: number) {
    if (!limit || !page) {
      throw new BadRequestException('invalid Data!');
    }
    const offset = (page - 1) * limit;
    const data = await this.prismaService.views.findMany({
      where: { contentId },
      include: { Child: true },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.views.count({
      where: { contentId },
    });
    return {
      data,
      pagination: { totalPages: Math.ceil(total / limit), page, limit },
    };
  }
  private async isMe(viewsId: string, userId: string) {
    const views = await this.prismaService.views.findUnique({
      where: { id: viewsId },
    });
    if (views?.childId !== userId) {
      throw new ForbiddenException('Forbidden!');
    }
  }
}
