import { BadRequestException, Injectable } from '@nestjs/common';
import { Register, Role } from 'src/auth/dto/register.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { AddFamily } from './dto/addFamily.dto';
@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}
  async addAdmin(dto: Register) {
    if (dto.pin) {
      dto.pin = await argon.hash(dto.pin);
    }
    dto.password = await argon.hash(dto.password);
    const existEmail = await this.prismaService.account.findUnique({
      where: { email: dto.email },
    });
    if (existEmail) {
      throw new BadRequestException('This Email is in our App!');
    }
    const accountAuthKey = crypto.randomUUID();
    const account = await this.prismaService.account.create({
      data: {
        email: dto.email,
        password: dto.password,
        accountRole: 'BUSINESS',
        authKey: accountAuthKey,
      },
    });
    const user = await this.prismaService.user.create({
      data: {
        role: Role.ADMIN,
        fullName: dto.fullName,
        birthdayDate: new Date(dto.birthdayDate),
        gender: dto.gender,
        accountId: account.id,
        pin: dto.pin,
      },
    });
    return { message: 'Admin Added Successfully!', user };
  }
  async addFamily(dto: AddFamily, accountId: string, userId: string) {
    const user = await this.prismaService.user.create({
      data: { accountId, ...dto },
    });
    if (dto.role === Role.CHILD) {
      await this.prismaService.parentsChildren.create({
        data: { childId: user.id, parentId: userId },
      });
    }
    return { message: 'Added Successfully And Share Your Account!', user };
  }
  async getProfile(userId: string, role: Role) {
    let profile;
    if (role == Role.ADMIN || role == Role.CHILD) {
      profile = await this.prismaService.user.findUnique({
        where: { id: userId },
        include: { account: { select: { email: true } } },
      });
    } else if (role == Role.CREATOR) {
      profile = await this.prismaService.user.findUnique({
        where: { id: userId },
        include: { account: { select: { email: true } }, balance: true },
      });
    } else if (role == Role.PARENT) {
      profile = await this.prismaService.user.findUnique({
        where: { id: userId },
        include: {
          account: { select: { email: true } },
          Parents: { include: { Child: true } },
        },
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return profile;
  }
  async getChildren(parentId: string) {
    return await this.prismaService.parentsChildren.findMany({
      where: { parentId },
      include: { Child: true },
    });
  }
}
