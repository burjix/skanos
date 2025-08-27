import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'skanos-jwt-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController, OnboardingController],
  providers: [AuthService, OnboardingService, LocalStrategy, JwtStrategy],
  exports: [AuthService, OnboardingService],
})
export class AuthModule {}