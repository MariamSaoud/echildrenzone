import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Register, Role } from './dto/register.dto';
import * as argon from 'argon2';
import { Login } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { MainRequestchooseAccount } from './dto/chooseAccount.dto';
import { RedisService } from 'src/redis/redis.service';
import { Logout } from './dto/logout.dto';
import { BusinessLogin } from './dto/businessLogin.dto';
import { changePassword } from './dto/changePassword.dto';
import { addFamily } from './dto/addFamily.dto';
import { refreshToken } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private Jwt: JwtService,
    private config: ConfigService,
    private redisService: RedisService,
  ) {}
  async register(dto: Register) {
    let user, account;
    dto.password = await argon.hash(dto.password);
    if (dto.pin) {
      dto.pin = await argon.hash(dto.pin);
    }
    const existEmail = await this.prismaService.account.findUnique({
      where: { email: dto.email },
    });
    if (existEmail) {
      throw new BadRequestException('This Email is in our App!');
    }
    if (dto.role == Role.ADMIN) {
      throw new BadRequestException('Ask Admin For Adding You!');
    }
    if (dto.role == Role.CREATOR) {
      account = await this.prismaService.account.create({
        data: {
          email: dto.email,
          password: dto.password,
          accountRole: 'BUSINESS',
        },
      });
      user = await this.prismaService.user.create({
        data: {
          role: Role.CREATOR,
          fullName: dto.fullName,
          birthdayDate: new Date(dto.birthdayDate),
          gender: dto.gender,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          accountId: account.id,
          pin: dto.pin,
        },
      });
      await this.prismaService.userBalance.create({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        data: { creatorId: user.id },
      });
    }
    if (dto.role == Role.PARENT) {
      account = await this.prismaService.account.create({
        data: {
          email: dto.email,
          password: dto.password,
          accountRole: 'PERSONAL',
        },
      });
      user = await this.prismaService.user.create({
        data: {
          role: Role.PARENT,
          fullName: dto.fullName,
          birthdayDate: new Date(dto.birthdayDate),
          gender: dto.gender,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          accountId: account.id,
          pin: dto.pin,
        },
      });
    }
    const payload = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      accountId: account.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userId: user.id,
    };
    const accessSecret: string = this.config.get('SECRET_ACCESS_TOKEN')!;
    const refreshSecret: string = this.config.get('SECRET_REFRESH_TOKEN')!;
    const accessToken = await this.Jwt.signAsync(payload, {
      secret: accessSecret,
    });

    await this.redisService.addToRedis(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      `token:${account.id}:${user.id}`,
      accessToken,
    );

    const refreshToken = await this.Jwt.signAsync(payload, {
      secret: refreshSecret,
    });
    return { accessToken, refreshToken };
  }
  async login(dto: Login) {
    const existEmail = await this.prismaService.account.findUnique({
      where: { email: dto.email },
    });
    if (!existEmail) {
      throw new NotFoundException('This Email is Not in our App!');
    }
    const isValidP = await argon.verify(existEmail.password, dto.password);
    if (!isValidP) {
      throw new BadRequestException('Wrong Password For This Email!');
    }
    const usersInAccount = await this.prismaService.user.findMany({
      where: { accountId: existEmail.id },
      select: { id: true, fullName: true, pin: true },
    });
    const usersArr = usersInAccount.map((user) => {
      const { pin, ...rest } = user;
      return {
        ...rest,
        requiredPin: pin !== null,
      };
    });
    const payload = {
      sub: existEmail.id,
      timestamp: new Date(),
    };
    const secret: string = this.config.get('SECRET_TEMP_LOGIN')!;
    const token = await this.Jwt.signAsync(payload, { secret: secret });
    return { usersArr, token };
  }
  async chooseAccount(dto: MainRequestchooseAccount) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const verifyToken = await this.Jwt.decode(dto.token);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const accountId = verifyToken.sub;
    const userId = dto.account.id;
    const myDate = new Date();
    const minutesToAdd = 5;
    myDate.setMinutes(myDate.getMinutes() + minutesToAdd);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (verifyToken.timestamp < myDate) {
      throw new NotFoundException('Late Request for it!');
    }
    if (dto.account.requiredPin) {
      if (!dto.pin) {
        throw new BadRequestException('PIN Is Required In This Case!');
      } else {
        const myPin = await this.prismaService.user.findFirst({
          where: { id: dto.account.id },
          select: { pin: true },
        });
        if (myPin?.pin) {
          const verifyPIN = await argon.verify(myPin.pin, dto.pin);
          if (!verifyPIN) {
            throw new ForbiddenException('Wrong PIN!');
          }
        }
      }
    }
    const payload = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      accountId,
      userId,
    };
    const accessSecret: string = this.config.get('SECRET_ACCESS_TOKEN')!;
    const refreshSecret: string = this.config.get('SECRET_REFRESH_TOKEN')!;
    const accessToken = await this.Jwt.signAsync(payload, {
      secret: accessSecret,
    });
    await this.redisService.addToRedis(
      `token:${accountId}:${userId}`,
      accessToken,
    );
    const refreshToken = await this.Jwt.signAsync(payload, {
      secret: refreshSecret,
    });
    return { accessToken, refreshToken };
  }
  async logout(dto: Logout) {
    await this.redisService.removeFromRedis(
      `token:${dto.accountId}:${dto.userId}`,
    );
    return { message: 'Logout Successfully!' };
  }
  async businessLogin(dto: BusinessLogin) {
    const existEmail = await this.prismaService.account.findUnique({
      where: { email: dto.email },
    });
    if (!existEmail) {
      throw new NotFoundException('This Email is Not in our App!');
    }
    const isValidP = await argon.verify(existEmail.password, dto.password);
    if (!isValidP) {
      throw new BadRequestException('Wrong Password For This Email!');
    }
    const businessUsers = await this.prismaService.user.findFirst({
      where: { accountId: existEmail.id },
      select: { id: true, pin: true },
    });
    if (!businessUsers) {
      throw new NotFoundException('User Not Found!');
    }
    if (businessUsers.pin) {
      if (!dto.pin) {
        throw new BadRequestException('PIN Is Required Here!');
      }
      const verifyPIN = await argon.verify(businessUsers.pin, dto.pin);
      if (!verifyPIN) {
        throw new ForbiddenException('Wrong PIN!');
      }
    }
    const payload = {
      accountId: existEmail.id,
      userId: businessUsers.id,
    };
    const accessSecret: string = this.config.get('SECRET_ACCESS_TOKEN')!;
    const refreshSecret: string = this.config.get('SECRET_REFRESH_TOKEN')!;
    const accessToken = await this.Jwt.signAsync(payload, {
      secret: accessSecret,
    });
    await this.redisService.addToRedis(
      `token:${existEmail.id}:${businessUsers.id}`,
      accessToken,
    );
    const refreshToken = await this.Jwt.signAsync(payload, {
      secret: refreshSecret,
    });
    return { accessToken, refreshToken };
  }
  async changePassword(dto: changePassword) {
    const existEmail = await this.prismaService.account.findUnique({
      where: { email: dto.email },
    });
    if (!existEmail) {
      throw new NotFoundException('This Email is Not in our App!');
    }
    const isValidP = await argon.verify(existEmail.password, dto.oldPassword);
    if (!isValidP) {
      throw new BadRequestException('Wrong Old Password For This Email!');
    }
    await this.redisService.deletePattern(`token:${existEmail.id}*`);
    const hashPassword = await argon.hash(dto.newPassword);
    await this.prismaService.account.update({
      where: { email: dto.email },
      data: { password: hashPassword },
    });
    return { message: 'Updated Successfully!' };
  }
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
    const account = await this.prismaService.account.create({
      data: {
        email: dto.email,
        password: dto.password,
        accountRole: 'BUSINESS',
      },
    });
    const user = await this.prismaService.user.create({
      data: {
        role: Role.CREATOR,
        fullName: dto.fullName,
        birthdayDate: new Date(dto.birthdayDate),
        gender: dto.gender,
        //@typescript-eslint/no-unsafe-member-access
        accountId: account.id,
        pin: dto.pin,
      },
    });
    return { message: 'Admin Added Successfully!', user };
  }
  async addFamily(dto: addFamily, accountId: number, userId: number) {
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
  async refreshToken(dto: refreshToken) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await this.Jwt.decode(dto.refreshToken);
    const payload = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      accountId: data.accountId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      userId: data.userId,
    };
    const accessSecret: string = this.config.get('SECRET_ACCESS_TOKEN')!;
    const refreshSecret: string = this.config.get('SECRET_REFRESH_TOKEN')!;
    const accessToken = await this.Jwt.signAsync(payload, {
      secret: accessSecret,
    });

    await this.redisService.addToRedis(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      `token:${data.accountId}:${data.userId}`,
      accessToken,
    );

    const refreshToken = await this.Jwt.signAsync(payload, {
      secret: refreshSecret,
    });
    return { accessToken, refreshToken };
  }
}
