import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service.js';
import * as argon from 'argon2';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  console.log('🚀 Starting Nest Seed (Emergency Bypass Mode)...');

  const configService = new ConfigService();

  const prisma = new PrismaService(configService);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pass = await configService.get('ADMIN_PASSWORD')!;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const adminPass: string = await argon.hash(pass);
    const adminEmail: string = await configService.get('ADMIN_EMAIL')!;
    const adminAccount = await prisma.account.create({
      data: { email: adminEmail, password: adminPass, accountRole: 'BUSINESS' },
    });
    const pinHash = await argon.hash(configService.get('ADMIN_PIN')!);
    await prisma.user.create({
      data: {
        accountId: adminAccount.id,
        fullName: 'first-admin',
        birthdayDate: new Date('2002-11-02'),
        gender: 'FEMALE',
        pin: pinHash,
        role: 'ADMIN',
      },
    });
    console.log('✅ SEED COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ SEED FAILED:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

bootstrap();
