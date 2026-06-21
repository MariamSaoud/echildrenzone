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
import { Logout, LogoutAll } from './dto/logout.dto';
import { BusinessLogin } from './dto/businessLogin.dto';
import { ChangePassword } from './dto/changePassword.dto';
import { RefreshToken } from './dto/refreshToken.dto';
import { uuidv7 } from 'uuidv7';
import * as crypto from 'crypto';
import { forgetPassword } from './dto/forgetPassword.dto';
import { PURPOSE, Verify } from 'src/email-sender/dto/verify.dto';
import { Send } from 'src/email-sender/dto/send.dto';
import { EmailService } from 'src/email-sender/email-sender.service';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private Jwt: JwtService,
    private config: ConfigService,
    private redisService: RedisService,
    private emailService: EmailService,
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
    const accountAuthKey = crypto.randomUUID();
    if (dto.role == Role.ADMIN) {
      throw new BadRequestException('Ask Admin For Adding You!');
    }
    if (dto.role == Role.CREATOR) {
      account = await this.prismaService.account.create({
        data: {
          authKey: accountAuthKey,
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
          accountId: account.id,
          pin: dto.pin,
        },
      });
      await this.prismaService.userBalance.create({
        data: { creatorId: user.id },
      });
    }
    if (dto.role == Role.PARENT) {
      account = await this.prismaService.account.create({
        data: {
          authKey: accountAuthKey,
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
          accountId: account.id,
          pin: dto.pin,
        },
      });
    }
    const authId = uuidv7();
    const payload = {
      authId,
      authKey: account.authKey,
      accountId: account.id,
      userId: user.id,
    };
    const accessSecret: string = this.config.get('SECRET_ACCESS_TOKEN')!;
    const refreshSecret: string = this.config.get('SECRET_REFRESH_TOKEN')!;
    const accessToken = await this.Jwt.signAsync(payload, {
      secret: accessSecret,
    });

    await this.redisService.addToRedis(`${authId}`, user.id);

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
      throw new NotFoundException('Invalid Data!');
    }
    const isValidP = await argon.verify(existEmail.password, dto.password);
    if (!isValidP) {
      throw new BadRequestException('Invalid Data!');
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
    const verifyToken = await this.Jwt.verifyAsync(dto.token, {
      secret: await this.config.get('SECRET_TEMP_LOGIN')!,
    });
    const accountId = verifyToken.sub;
    const userId = dto.id;
    const myDate = new Date();
    const minutesToAdd = 5;
    myDate.setMinutes(myDate.getMinutes() + minutesToAdd);
    if (verifyToken.timestamp < myDate) {
      throw new NotFoundException('Late Request for it!');
    }
    const myPin = await this.prismaService.user.findFirst({
      where: { id: dto.id },
      select: { pin: true },
    });
    if (!myPin) {
      throw new NotFoundException('User Not Found!');
    }
    if (!dto.pin && myPin.pin) {
      throw new BadRequestException('PIN Is Required In This Case!');
    } else {
      if (myPin?.pin) {
        const verifyPIN = await argon.verify(myPin.pin, dto.pin);
        if (!verifyPIN) {
          throw new ForbiddenException('Wrong PIN!');
        }
      }
    }
    const account = await this.prismaService.account.findUnique({
      where: { id: accountId },
      select: { authKey: true },
    });
    const authId = uuidv7();
    const payload = {
      authId,
      authKey: account!.authKey,
      accountId,
      userId,
    };
    const accessSecret: string = this.config.get('SECRET_ACCESS_TOKEN')!;
    const refreshSecret: string = this.config.get('SECRET_REFRESH_TOKEN')!;
    const accessToken = await this.Jwt.signAsync(payload, {
      secret: accessSecret,
    });
    await this.redisService.addToRedis(`${authId}`, userId);
    const refreshToken = await this.Jwt.signAsync(payload, {
      secret: refreshSecret,
    });
    return { accessToken, refreshToken };
  }
  async logout(dto: Logout) {
    await this.redisService.removeFromRedis(`${dto.authId}`);
    return { message: 'Logout Successfully!' };
  }
  async logoutAll(dto: LogoutAll) {
    //terminate all sessions for all accounts
    const accountAuthKey = crypto.randomUUID();
    //make tokens invalid
    await this.prismaService.account.update({
      where: { id: dto.accountId },
      data: { authKey: accountAuthKey },
    });
    return { message: 'Logout Successfully!' };
  }
  async businessLogin(dto: BusinessLogin) {
    const existEmail = await this.prismaService.account.findUnique({
      where: { email: dto.email },
    });
    if (!existEmail) {
      throw new NotFoundException('Invalid Data!');
    }
    const isValidP = await argon.verify(existEmail.password, dto.password);
    if (!isValidP) {
      throw new BadRequestException('Invalid Data!');
    }
    const businessUsers = await this.prismaService.user.findFirst({
      where: { accountId: existEmail.id },
      select: { id: true, pin: true },
    });
    if (!businessUsers) {
      throw new NotFoundException('User Not Found!');
    }
    const authId = uuidv7();
    const payload = {
      authId,
      authKey: existEmail.authKey,
      accountId: existEmail.id,
      userId: businessUsers.id,
    };
    const accessSecret: string = this.config.get('SECRET_ACCESS_TOKEN')!;
    const refreshSecret: string = this.config.get('SECRET_REFRESH_TOKEN')!;
    const accessToken = await this.Jwt.signAsync(payload, {
      secret: accessSecret,
    });
    await this.redisService.addToRedis(`${authId}`, businessUsers.id);
    const refreshToken = await this.Jwt.signAsync(payload, {
      secret: refreshSecret,
    });
    return { accessToken, refreshToken };
  }
  async changePassword(id: string, dto: ChangePassword) {
    const existEmail = await this.prismaService.account.findUnique({
      where: { email: dto.email },
    });
    if (!existEmail) {
      throw new NotFoundException('Invalid Data!');
    }
    const isValidP = await argon.verify(existEmail.password, dto.oldPassword);
    if (!isValidP) {
      throw new BadRequestException('Invalid Data!');
    }
    if (id !== existEmail.id) {
      throw new ForbiddenException('Invalid Data');
    }
    const similarPass = await argon.verify(
      existEmail.password,
      dto.newPassword,
    );
    if (similarPass) {
      throw new BadRequestException('Invalid Data!'); //we shouldn't change the password to the same pass
    }
    if (dto.terminateAllSessions) {
      const accountAuthKey = crypto.randomUUID();
      //make tokens invalid
      await this.prismaService.account.update({
        where: { email: dto.email },
        data: { authKey: accountAuthKey },
      });
    }
    const hashPassword = await argon.hash(dto.newPassword);
    await this.prismaService.account.update({
      where: { email: dto.email },
      data: { password: hashPassword },
    });
    return { message: 'Updated Successfully!' };
  }

  async refreshToken(dto: RefreshToken) {
    const data = await this.Jwt.verifyAsync(dto.refreshToken, {
      secret: await this.config.get('SECRET_REFRESH_TOKEN')!,
    });
    const authId = uuidv7();
    const payload = {
      authId,
      authKey: data.authKey,
      accountId: data.accountId,
      userId: data.userId,
    };
    const accessSecret: string = this.config.get('SECRET_ACCESS_TOKEN')!;
    const refreshSecret: string = this.config.get('SECRET_REFRESH_TOKEN')!;
    const accessToken = await this.Jwt.signAsync(payload, {
      secret: accessSecret,
    });

    await this.redisService.addToRedis(`${authId}`, data.userId);

    const refreshToken = await this.Jwt.signAsync(payload, {
      secret: refreshSecret,
    });
    return { accessToken, refreshToken };
  }
  async forgetPassword(dto: forgetPassword) {
    const verifyToken = await this.Jwt.verifyAsync(dto.token, {
      secret: await this.config.get('SECRET_TEMP_LOGIN')!,
    });
    const myDate = new Date();
    const minutesToAdd = 30;
    myDate.setMinutes(myDate.getMinutes() + minutesToAdd);
    if (verifyToken.time > myDate) {
      throw new BadRequestException('too late for it!');
    }
    if (verifyToken.fieldType == PURPOSE.FORGET_PASSWORD) {
      const hashedPass = await argon.hash(dto.password);
      await this.prismaService.account.update({
        where: { id: verifyToken.accountId },
        data: { password: hashedPass },
      });
      return { message: 'Changed Successfully!' };
    }
  }

  async verifyOTP(dto: Verify) {
    const myOTP = await this.redisService.getFromRedis(dto.email);
    if (!myOTP) {
      throw new NotFoundException('Invalid re-send the otp');
    }
    const otp = myOTP;

    if (!otp) {
      throw new NotFoundException('otp not found!');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const matchOTP = await argon.verify(otp, dto.otp);
    if (!matchOTP) {
      throw new ForbiddenException('Invalid!');
    }
    const account = await this.prismaService.account.findUnique({
      where: { email: dto.email },
    });
    const secret = await this.config.get('SECRET_TEMP_LOGIN');
    const token = await this.Jwt.signAsync(
      {
        time: new Date(),
        fieldType: dto.purpose,
        accountId: account!.id,
      },
      { secret },
    );
    return { token };
  }
  async sendOTP(dto: Send) {
    const emailHere = await this.prismaService.account.findUnique({
      where: { email: dto.email },
    });
    if (!emailHere) {
      throw new NotFoundException('Email Not Found!');
    } else {
      return await this.emailService.sendOTP(dto);
    }
  }
  async deleteUser(id: string, role: Role, accId: string) {
    await this.prismaService.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    const total = await this.prismaService.user.count({
      where: { accountId: accId },
    });
    if (total === 0) {
      await this.prismaService.account.update({
        where: { id: accId },
        data: { deletedAt: new Date() },
      });
    }
    if (role === Role.CREATOR) {
      await this.prismaService.userBalance.update({
        where: { creatorId: id },
        data: { deletedAt: new Date() },
      });
    }
    return { message: 'Deleted Successfully!' };
  }
}
