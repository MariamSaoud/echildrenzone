import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class hasPIN implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const Request = context.switchToHttp().getRequest();
    if (!Request) {
      return false;
    }
    const user = Request.user;
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    if (!user.pin) {
      return false;
    }
    return true;
  }
}
