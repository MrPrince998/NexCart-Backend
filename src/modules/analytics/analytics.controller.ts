import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '@/common/enums';
import {
  ForbiddenResponse,
  UnauthorizedResponse,
} from '@/common/schemas/error.response';
import { Roles } from '@/core/decorators/roles.decorator';
import {
  DashboardAnalyticsResponseDto,
  SalesSummaryResponseDto,
} from '@/common/schemas/commerce.response';
import { AnalyticsService } from './analytics.service';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
@ApiForbiddenResponse({ type: ForbiddenResponse })
@Roles(Role.ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin: get dashboard analytics' })
  @ApiOkResponse({
    type: DashboardAnalyticsResponseDto,
    description: 'Dashboard analytics retrieved successfully',
  })
  dashboard() {
    return this.analyticsService.dashboard();
  }

  @Get('analytics/sales')
  @ApiOperation({ summary: 'Admin: get sales summary analytics' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    example: '2026-05-01',
    description: 'Inclusive start date for the sales summary',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    example: '2026-05-16',
    description: 'Inclusive end date for the sales summary',
  })
  @ApiOkResponse({
    type: SalesSummaryResponseDto,
    description: 'Sales summary retrieved successfully',
  })
  salesSummary(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.analyticsService.salesSummary(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('analytics/behavior')
  @ApiOperation({ summary: 'Admin: get behavior analytics' })
  behaviorSummary() {
    return this.analyticsService.behaviorSummary();
  }

  @Get('analytics/recommendations')
  @ApiOperation({ summary: 'Admin: get recommendation analytics' })
  recommendationSummary() {
    return this.analyticsService.recommendationSummary();
  }
}
