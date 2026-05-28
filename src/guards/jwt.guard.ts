import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/jwt.ispublic.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
    private prismaService: PrismaService,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    // 💡 Here the JWT secret key that's used for verifying the payload
    // is the key that was passed in the JwtModule
    const payload = await this.jwtService.verifyAsync(token);
    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
    const myUser = await this.prismaService.user.findUnique({
      where: { id: payload.userId },
    });
    if (!myUser) {
      throw new NotFoundException('This User is not in our App!');
    }
    //find in redis and is valid authKey
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const findInRedis = await this.redisService.getFromRedis(payload.authId);
    if (!findInRedis) {
      throw new NotFoundException('Cannot Find This Session In Redis');
    }
    const account = await this.prismaService.account.findUnique({
      where: { id: payload.accountId },
      select: { authKey: true },
    });
    if (!account) {
      throw new NotFoundException('Account Not Found!');
    }
    if (payload.authKey !== account.authKey) {
      throw new ForbiddenException('Invalid data');
    }
    request['user'] = myUser;
    request['accountId'] = payload.accountId;
    request['authId'] = payload.authId;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
