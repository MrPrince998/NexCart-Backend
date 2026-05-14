import { Controller, All, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { auth } from '@/integrations/auth/auth';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  @All('*')
  @ApiOperation({
    summary: 'Better Auth handler',
    description:
      'Handles all authentication routes (sign up, sign in, sign out, etc.). Routes will vary based on configured providers.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication request handled successfully',
    schema: {
      example: {
        success: true,
        message: 'Authentication processed',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid email format',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Route not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
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
