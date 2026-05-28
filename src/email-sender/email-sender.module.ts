import { EmailService } from './email-sender.service';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { JwtModule } from '@nestjs/jwt';
@Module({
  controllers: [],
  providers: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'lovelymarmoush.saoud14@gmail.com',
          pass: 'todyrrftmcjdfnfd',
        },
        tls: {
          rejectUnauthorized: false,
          family: 4,
        },
      },
      defaults: {
        from: '"echildrenzone" <echildrenzone@example.com>',
      },
      template: {
        adapter: new HandlebarsAdapter(),
      },
    }),
    JwtModule,
  ],
  exports: [EmailService],
})
export class EmailModule {}
