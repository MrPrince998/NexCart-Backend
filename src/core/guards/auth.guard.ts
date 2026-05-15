import { auth } from '@/integrations/auth/auth';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      'IS_PUBLIC_KEY',
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true; // Allow access to public routes
    }

    const request = context.switchToHttp().getRequest();

    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: request.headers.cookie ?? '',
        authorization: request.headers.authorization ?? '',
      }),
    });

    if (!session?.user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    request.user = session.user;
    request.session = session.session;

    return true;
  }
}
