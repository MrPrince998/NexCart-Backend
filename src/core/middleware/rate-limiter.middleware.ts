import { Injectable, NestMiddleware } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private limiters: Record<string, RateLimiterMemory> = {};

  constructor() {
    // 10 per minute for auth routes
    this.limiters['/auth'] = new RateLimiterMemory({
      points: 10,
      duration: 60,
      execEvenly: true,
      blockDuration: 120, // block for 2 minute after 10 requests
    });

    // 100 per minute for all other routes
    this.limiters['/api'] = new RateLimiterMemory({
      points: 100,
      duration: 60,
      execEvenly: true,
      blockDuration: 300, // block for 5 minute after 100 requests
    });
  }

  private getClientKey(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'];
    const firstForwarded = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0]?.trim();

    const rawIp =
      firstForwarded || req.ip || req.socket.remoteAddress || 'unknown';

    // Normalize common localhost representations to a single key.
    if (rawIp === '::1' || rawIp === '::ffff:127.0.0.1') {
      return '127.0.0.1';
    }

    return rawIp;
  }

  private resolveLimiter(req: Request): RateLimiterMemory {
    const pathname = (req.originalUrl || req.url || req.path || '')
      .split('?')[0]
      .replace(/\/+/g, '/');

    // auth routes get stricter limits
    if (/^\/(?:api(?:\/v\d+)?)?\/auth(?:\/|$)/.test(pathname)) {
      return this.limiters['/auth'];
    }

    // all other API routes get the general limiter
    if (/^\/api(?:\/v\d+)?(?:\/|$)/.test(pathname)) {
      return this.limiters['/api'];
    }

    return this.limiters['/api'];
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const limiter = this.resolveLimiter(req);

    if (!limiter) return next();

    limiter
      .consume(this.getClientKey(req))
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).json({
          success: false,
          statusCode: 429,
          title: 'Too Many Requests',
          message: 'You have made too many requests. Please try again later.',
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
        });
      });
  }
}
