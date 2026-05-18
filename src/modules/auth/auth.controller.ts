import { Controller, All, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { SuccessResponse } from '@/common/schemas/success.response';
import {
  ErrorResponse,
  UnauthorizedResponse,
  NotFoundResponse,
  InternalServerErrorResponse,
} from '@/common/schemas/error.response';
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
    type: SuccessResponse,
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Authentication successful',
        data: {
          user: {
            id: 'user_123',
            email: 'user@example.com',
            name: 'John Doe',
          },
          token: 'jwt_token_here',
        },
        timestamp: '2026-05-13T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
    type: UnauthorizedResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Route not found',
    type: NotFoundResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  async handleAuth(@Req() req: any, @Res() res: any) {
    const response = await auth.handler(req);
    if (response) {
      res.status(response.status || 200);
      for (const [key, value] of Object.entries(response.headers || {})) {
        res.setHeader(key, value);
      }
      res.send(response.body);
    } else {
      res.status(404).send('Not Found');
    }
  }
}
