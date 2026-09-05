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
import { userActionsPricingModule } from './user-actions-pricing-config/user-actions-pricing-config.module';
import { PlaylistModule } from './playlist/playlist.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { BlockedChannelModule } from './blocked-channel/blocked-channel.module';
import { ContentModule } from './content/content.module';
import { ContentTfQuestionsModule } from './content-tf-questions/content-tf-questions.module';
import { ReactionModule } from './reaction/reaction.module';
import { CommentModule } from './comment/comment.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ViewsModule } from './views/views.module';
import { UserBalanceModule } from './user-balance/user-balance.module';
import { StoriesModule } from './stories/stories.module';
import { AdsPaymentModule } from './ads-payment/ads-payment.module';
import { AdsModule } from './ads/ads.module';
import { StorageModule } from './storage/storage.module';
import { VideosModule } from './videos/videos.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { ScheduledStoriesModule } from './scheduled-stories/scheduled-stories.module';
import { UserCategoryScoreModule } from './user-category-score/user-category-score.module';
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
    userActionsPricingModule,
    PlaylistModule,
    SubscriptionModule,
    BlockedChannelModule,
    ContentModule,
    ContentTfQuestionsModule,
    ReactionModule,
    CommentModule,
    FavoritesModule,
    ViewsModule,
    UserBalanceModule,
    StoriesModule,
    AdsPaymentModule,
    AdsModule,
    StorageModule,
    VideosModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot(),
    ScheduledStoriesModule,
    UserCategoryScoreModule,
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
