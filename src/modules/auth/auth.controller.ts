import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { auth } from '@/integrations/auth/auth';

@Controller('/auth')
export class AuthController {
  @All('*')
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
