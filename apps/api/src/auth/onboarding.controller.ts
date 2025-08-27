import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { OnboardingService, OnboardingData } from './onboarding.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('status')
  async getOnboardingStatus(@Request() req: any) {
    const userId = req.user.userId;
    return this.onboardingService.getUserOnboardingStatus(userId);
  }

  @Put('step')
  async updateOnboardingStep(
    @Request() req: any,
    @Body() body: { step: number; data: any }
  ) {
    const userId = req.user.userId;
    const { step, data } = body;
    return this.onboardingService.updateOnboardingStep(userId, step, data);
  }

  @Post('complete')
  async completeOnboarding(
    @Request() req: any,
    @Body() body: { data: OnboardingData }
  ) {
    const userId = req.user.userId;
    return this.onboardingService.completeOnboarding(userId, body.data);
  }

  @Post('skip')
  async skipOnboarding(@Request() req: any) {
    const userId = req.user.userId;
    return this.onboardingService.skipOnboarding(userId);
  }

  @Post('reset')
  async resetOnboarding(@Request() req: any) {
    const userId = req.user.userId;
    return this.onboardingService.resetOnboarding(userId);
  }
}