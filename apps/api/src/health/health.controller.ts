import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces';

@ApiTags('health')
@Controller('health')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get health metrics' })
  async getHealthMetrics(@Request() req: AuthenticatedRequest) {
    return this.healthService.getHealthMetrics(req.user.id);
  }
}