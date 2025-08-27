import { Controller, Post, Body, UseGuards, Get, Request, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces';
import type { LoginRequest, RegisterRequest } from '@skanos/shared';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginData: LoginRequest) {
    return this.authService.login(loginData);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user (hardcoded user only)' })
  async register(@Body() registerData: RegisterRequest) {
    return this.authService.register(registerData);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get('otp/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Setup OTP authentication' })
  async setupOtp(@Request() req: AuthenticatedRequest) {
    return this.authService.setupOtp(req.user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Request() req: AuthenticatedRequest) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }
    return this.authService.logout(token);
  }
}