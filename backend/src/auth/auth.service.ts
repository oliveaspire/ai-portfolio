import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async validateUser(details: any) {
    const allowedEmailsStr = this.configService.get<string>(
      'ALLOWED_ADMIN_EMAILS',
    );

    if (allowedEmailsStr) {
      const allowedEmails = allowedEmailsStr
        .split(',')
        .map((e) => e.trim().toLowerCase());
      if (!allowedEmails.includes(details.email.toLowerCase())) {
        throw new UnauthorizedException(
          'Your email is not authorized to access this admin panel.',
        );
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { email: details.email },
    });

    if (user) {
      return this.prisma.user.update({
        where: { email: details.email },
        data: { name: details.name, picture: details.picture },
      });
    }

    return this.prisma.user.create({
      data: {
        email: details.email,
        name: details.name,
        picture: details.picture,
        role: 'admin',
      },
    });
  }

  async generateJwt(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const jwtSecret =
      this.configService.get<string>('JWT_SECRET') || 'defaultSecretChangeMe';
    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'defaultRefreshSecretChangeMe';

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: '7d',
    });

    // Store refresh token in DB so we can revoke it on logout
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(token: string) {
    try {
      const jwtRefreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'defaultRefreshSecretChangeMe';
      const payload = this.jwtService.verify(token, {
        secret: jwtRefreshSecret,
      });

      // Check token exists in DB (not revoked by logout)
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      if (storedToken.expiresAt < new Date()) {
        // Clean up expired token
        await this.prisma.refreshToken.delete({ where: { token } });
        throw new UnauthorizedException('Refresh token expired');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Rotate: delete old token, issue new pair
      await this.prisma.refreshToken.delete({ where: { token } });
      return this.generateJwt(user);
    } catch (e: any) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    // Delete the refresh token from DB — it can never be used again
    try {
      await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
    } catch {
      // Token not found (already gone) — that's fine
    }
  }
}
