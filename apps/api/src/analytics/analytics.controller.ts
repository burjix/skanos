import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get analytics data' })
  @ApiQuery({ name: 'period', required: false })
  @ApiQuery({ name: 'pillar', required: false })
  async getAnalytics(
    @Request() req: AuthenticatedRequest,
    @Query('period') period?: string,
    @Query('pillar') pillar?: string,
  ) {
    return this.analyticsService.getAnalytics(req.user.id, { period, pillar });
  }
}