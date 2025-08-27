import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WealthService } from './wealth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces';

@ApiTags('wealth')
@Controller('wealth')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WealthController {
  constructor(private readonly wealthService: WealthService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get wealth metrics' })
  async getWealthMetrics(@Request() req: AuthenticatedRequest) {
    return this.wealthService.getWealthMetrics(req.user.id);
  }
}