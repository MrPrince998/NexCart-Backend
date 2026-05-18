import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums';
import { CurrentUser } from '@/core/decorators/current-user.decorator';
import { Public } from '@/core/decorators/public.decorator';
import { Roles } from '@/core/decorators/roles.decorator';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
@ApiTags('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('popular')
  @Public()
  @ApiOperation({ summary: 'Get popular products' })
  popular(@Query('limit') limit?: string) {
    return this.recommendationsService.popular(limit ? Number(limit) : 12);
  }

  @Get('trending')
  @Public()
  @ApiOperation({ summary: 'Get trending products from recent views' })
  trending(@Query('limit') limit?: string) {
    return this.recommendationsService.trending(limit ? Number(limit) : 12);
  }

  @Get('similar/:productId')
  @Public()
  @ApiOperation({ summary: 'Get similar products by category' })
  similar(@Param('productId') productId: string, @Query('limit') limit?: string) {
    return this.recommendationsService.similar(productId, limit ? Number(limit) : 8);
  }

  @Get('personalized')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get personalized product recommendations' })
  personalized(@CurrentUser('id') userId: string, @Query('limit') limit?: string) {
    return this.recommendationsService.personalized(userId, limit ? Number(limit) : 12);
  }

  @Post('rebuild-popular')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Admin: rebuild popular recommendation scores' })
  rebuildPopularScores() {
    return this.recommendationsService.rebuildPopularScores();
  }
}
