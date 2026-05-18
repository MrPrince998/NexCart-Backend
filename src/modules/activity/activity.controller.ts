import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import { ActivityService } from './activity.service';
import { TrackActivityDto } from './dto/track-activity.dto';

@Controller('activity')
@ApiTags('activity')
@ApiBearerAuth('access-token')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track user activity or product view' })
  track(@CurrentUser('id') userId: string | undefined, @Body() dto: TrackActivityDto) {
    return this.activityService.track(userId ?? null, dto);
  }

  @Get('recently-viewed')
  @ApiOperation({ summary: 'Get current user recently viewed products' })
  recentlyViewed(@CurrentUser('id') userId: string, @Query('limit') limit?: string) {
    return this.activityService.recentlyViewed(userId, limit ? Number(limit) : 10);
  }

  @Get('logs')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: get recent activity logs' })
  activityLogs() {
    return this.activityService.activityLogs();
  }
}
