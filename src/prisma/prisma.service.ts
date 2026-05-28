import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
  constructor(config: ConfigService) {
    // eslint-disable-next-line, @typescript-eslint/no-unsafe-call
    const pool = new Pool({
      connectionString: config.get<string>('DATABASE_URL'),
    });
    // eslint-disable-next-line, @typescript-eslint/no-unsafe-call
    const adapter = new PrismaPg(pool);
    super({
      adapter: adapter,
      log: [{ emit: 'event', level: 'query' }],
    });
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    // eslint-disable-next-line
    await this.pool.end(); 
  }
}
