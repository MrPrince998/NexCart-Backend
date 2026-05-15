import { IPolicyHandler } from '@/common/handler/permission.handler';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_PERMISSION_KEY } from '../decorators/check-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlers = this.reflector.getAllAndOverride<IPolicyHandler[]>(
      CHECK_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!handlers?.length) return true; // no permissions required

    const results = await Promise.all(
      handlers.map((handler) => handler.handle(context)),
    );

    const allowed = results.every(Boolean);

    if (!allowed)
      throw new ForbiddenException('Forbidden: insufficient permissions');

    return true;
  }
}
