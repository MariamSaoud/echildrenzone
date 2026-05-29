import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAccountId = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const accountId = request.accountId;
    if (!accountId) {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return accountId;
  },
);
