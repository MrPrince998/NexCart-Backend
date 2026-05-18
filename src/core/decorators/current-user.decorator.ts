import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const CurrentUser = createParamDecorator<string | undefined>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    return data && user ? user[data as keyof typeof user] : user;
  },
);
