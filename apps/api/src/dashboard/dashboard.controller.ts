import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces';
import type { QuickCaptureRequest } from '@skanos/shared';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard data' })
  async getDashboardData(@Request() req: AuthenticatedRequest) {
    return this.dashboardService.getDashboardData(req.user.id);
  }

  @Get('quick-capture')
  @ApiOperation({ summary: 'Get unprocessed quick captures' })
  async getQuickCapture(@Request() req: AuthenticatedRequest) {
    return this.dashboardService.getQuickCapture(req.user.id);
  }

  @Post('quick-capture')
  @ApiOperation({ summary: 'Create quick capture' })
  async createQuickCapture(@Request() req: AuthenticatedRequest, @Body() data: QuickCaptureRequest) {
    return this.dashboardService.createQuickCapture(req.user.id, data.content);
  }
}