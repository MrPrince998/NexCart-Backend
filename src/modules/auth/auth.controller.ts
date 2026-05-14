import { Controller, All, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { auth } from '@/integrations/auth/auth';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  @All('*')
  @ApiOperation({ summary: 'Better Auth handler', description: 'Handles all authentication routes (sign up, sign in, sign out, etc.)' })
  @ApiResponse({ status: 200, description: 'Authentication request handled successfully' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  async handleAuth(@Req() req: any, @Res() res: any) {
    const response = await auth.handler(req as any);
    if (response) {
      res.status(response.status || 200);
      for (const [key, value] of Object.entries(response.headers || {})) {
        res.setHeader(key, value as string | string[]);
      }
      res.send(response.body);
    } else {
      res.status(404).send('Not Found');
    }
  }
}
