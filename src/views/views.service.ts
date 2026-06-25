import { Injectable } from '@nestjs/common';
import { AddView } from './dto/views.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserBalanceService } from 'src/user-balance/user-balance.service';

@Injectable()
export class ViewsService {
  constructor(
    private prismaService: PrismaService,
    private userBalance: UserBalanceService,
  ) {}
  async addView(childId: string, dto: AddView) {
    const data = await this.prismaService.views.create({
      data: { ...dto, childId },
    });
    await this.userBalance.depositBalance(dto.contentId, 'VIEW');
    return { data };
  }
}
