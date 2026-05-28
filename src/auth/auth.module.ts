import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email-sender/email-sender.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [JwtModule, EmailModule],
})
export class AuthModule {}
