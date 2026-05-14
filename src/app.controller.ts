import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
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
    schema: {
      example: 'Hello World!',
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        success: false,
        statusCode: 500,
        title: 'Internal Server Error',
        message: 'Something went wrong',
        timestamp: '2024-05-14T10:30:00.000Z',
        path: '/api/v1',
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
