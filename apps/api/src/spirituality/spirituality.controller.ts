import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SpiritualityService } from './spirituality.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces';

@ApiTags('spirituality')
@Controller('spirituality')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SpiritualityController {
  constructor(private readonly spiritualityService: SpiritualityService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get spirituality metrics' })
  async getSpiritualityMetrics(@Request() req: AuthenticatedRequest) {
    return this.spiritualityService.getSpiritualityMetrics(req.user.id);
  }
}