import {
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/auth/dto/register.dto';
import { ROLES_KEY } from 'src/decorators/rolesGuard.decorator';

export class rolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private reflector: Reflector) {} //Helper class providing Nest reflection capabilities.
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
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
    if (!user.role) {
      return false;
    }
    for (let i = 0; i < requiredRoles.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (Role[requiredRoles[i]] == user.role) {
        return true;
      }
    }
    return false;
  }
}
