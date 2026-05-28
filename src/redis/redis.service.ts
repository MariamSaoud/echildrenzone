import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';
@Injectable()
export class RedisService {
  private client: RedisClientType;
  constructor(private configService: ConfigService) {
    const redisUrl: string = configService.get('REDIS_URL')!;
    this.client = createClient({ url: redisUrl });
    this.client.on('error', (error) => {
      console.error(error);
      console.error('Cannot Connect To Redis!');
    });
    this.client
      .connect()
      .then(() => console.log('Connected Successfully To Redis!'))
      .catch((error) => console.error(error));
  }
  async addToRedis(key: string, value: any) {
    return await this.client.set(key, JSON.stringify(value), {
      expiration: { type: 'EX', value: 3600 },
    });
  }
  async removeFromRedis(key: string) {
    return await this.client.del(key);
  }
  async deletePattern(pattern: string) {
    const patternMatches = this.client.scanIterator({ MATCH: pattern });
    let keysBatch: string[] = [];
    for await (const result of patternMatches) {
      if (Array.isArray(result)) {
        keysBatch.push(...result);
      } else {
        keysBatch.push(result);
      }

      if (keysBatch.length >= 100) {
        await this.client.del(keysBatch);
        keysBatch = [];
      }
    }

    if (keysBatch.length > 0) {
      await this.client.del(keysBatch);
    }

    return true;
  }
  async getFromRedis(key: string) {
    const itemFromRedis = await this.client.get(key);
    if (!itemFromRedis) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(itemFromRedis);
  }
}
