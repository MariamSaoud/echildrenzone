import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class IsntBlocked implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const Request = context.switchToHttp().getRequest();
    if (!Request) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = Request.user;
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (user.isBlocked) {
      return false;
    }
    return true;
  }
}
