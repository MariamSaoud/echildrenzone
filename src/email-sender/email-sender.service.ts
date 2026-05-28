import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RedisService } from 'src/redis/redis.service';
import * as argon from 'argon2';
import { Send } from './dto/send.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private redisService: RedisService,
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwt: JwtService,
  ) {}
  async sendOTP(dto: Send) {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    await this.mailerService.sendMail({
      to: dto.email,
      subject: 'Verify Your Email',
      template: 'welcome',
      html: `<p>Enter <b>${otp}</b> In The App To Verify Your Email ,Make Sure That This Code <b>Expires In 1 Hour</b></p>`,
    });
    const hashedOTP = await argon.hash(otp);
    await this.redisService.addToRedis(dto.email, hashedOTP);
    return { message: 'OTP Sent Successfully!' };
  }
}
