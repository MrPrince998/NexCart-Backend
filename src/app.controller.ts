import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Get a hello message to verify the API is running' })
  @ApiResponse({ status: 200, description: 'Returns hello message' })
  getHello(): string {
    return this.appService.getHello();
  }
}
