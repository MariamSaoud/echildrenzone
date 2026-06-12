import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EmailModule } from './email-sender/email-sender.module';
import { ChannelModule } from './channel/channel.module';
import { CategoryModule } from './category/category.module';
import { ContentAgeModule } from './content-age/content-age.module';
import { ReachedToContentModule } from './reached-to-content/reached-to-content.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_ACCESS_TOKEN'),
      }),
    }),
    UserModule,
    EmailModule,
    ChannelModule,
    CategoryModule,
    ContentAgeModule,
    ReachedToContentModule,
    PlaylistModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
