import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from '@/common/schemas/success.response';
import { InternalServerErrorResponse } from '@/common/schemas/error.response';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Get a hello message to verify the API is running',
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy and running',
    type: SuccessResponse,
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'API is running successfully',
        data: 'Hello World!',
        timestamp: '2026-05-13T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponse,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
