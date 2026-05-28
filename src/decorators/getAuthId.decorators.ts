import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAuthId = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authId = request.authId;
    if (!authId) {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return authId;
  },
);
