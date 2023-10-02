import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RequestUserID = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().userId;
});
