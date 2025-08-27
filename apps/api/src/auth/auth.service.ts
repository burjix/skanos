import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import * as otplib from 'otplib';
import * as qrcode from 'qrcode';
import type { LoginRequest, RegisterRequest } from '@skanos/shared';

@Injectable()
export class AuthService {
  // Hardcoded user credentials for Skander
  private readonly HARDCODED_USER = {
    email: 'skander@skanos.dev',
    password: 'SkanOS2024!',
    name: 'Skander',
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.initializeHardcodedUser();
  }

  private async initializeHardcodedUser() {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: this.HARDCODED_USER.email },
      });

      if (!existingUser) {
        const hashedPassword = await argon2.hash(this.HARDCODED_USER.password);
        const otpSecret = otplib.authenticator.generateSecret();

        await this.prisma.user.create({
          data: {
            email: this.HARDCODED_USER.email,
            password: hashedPassword,
            name: this.HARDCODED_USER.name,
            otpSecret,
            pillars: {
              create: [
                {
                  name: 'Health',
                  description: 'Physical and mental wellbeing',
                  color: '#10B981',
                  icon: '💪',
                  order: 1,
                },
                {
                  name: 'Wealth',
                  description: 'Financial growth and security',
                  color: '#F59E0B',
                  icon: '💰',
                  order: 2,
                },
                {
                  name: 'Spirituality',
                  description: 'Inner peace and purpose',
                  color: '#8B5CF6',
                  icon: '🧘',
                  order: 3,
                },
              ],
            },
          },
        });
        console.log('✅ Hardcoded user initialized');
      }
    } catch (error) {
      console.log('⚠️  User initialization skipped (database not ready)');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await argon2.verify(user.password, password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginData: LoginRequest) {
    const user = await this.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check OTP if provided
    if (loginData.otpCode && user.otpSecret) {
      const isValidOtp = otplib.authenticator.verify({
        token: loginData.otpCode,
        secret: user.otpSecret,
      });

      if (!isValidOtp) {
        throw new UnauthorizedException('Invalid OTP code');
      }
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    // Create session
    const session = await this.prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async register(registerData: RegisterRequest) {
    // Only allow the hardcoded user to register
    if (registerData.email !== this.HARDCODED_USER.email) {
      throw new UnauthorizedException('Registration not allowed for this email');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerData.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await argon2.hash(registerData.password);
    const otpSecret = otplib.authenticator.generateSecret();

    const user = await this.prisma.user.create({
      data: {
        email: registerData.email,
        password: hashedPassword,
        name: registerData.name,
        otpSecret,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async setupOtp(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.otpSecret) {
      throw new UnauthorizedException('User not found');
    }

    const otpauth_url = otplib.authenticator.keyuri(
      user.email,
      'SkanOS',
      user.otpSecret,
    );

    const qrCodeUrl = await qrcode.toDataURL(otpauth_url);

    return {
      secret: user.otpSecret,
      qrCode: qrCodeUrl,
    };
  }

  async verifyOtp(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.otpSecret) {
      throw new UnauthorizedException('User not found');
    }

    return otplib.authenticator.verify({
      token,
      secret: user.otpSecret,
    });
  }

  async logout(token: string) {
    await this.prisma.session.delete({
      where: { token },
    });
  }
}