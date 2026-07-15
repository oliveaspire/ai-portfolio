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
    const allowedEmailsStr = this.configService.get<string>('ALLOWED_ADMIN_EMAILS');
    
    if (allowedEmailsStr) {
      const allowedEmails = allowedEmailsStr.split(',').map((e) => e.trim().toLowerCase());
      if (!allowedEmails.includes(details.email.toLowerCase())) {
        throw new UnauthorizedException('Your email is not authorized to access this admin panel.');
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

  generateJwt(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
