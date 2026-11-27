import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import ms, { type StringValue } from 'ms';
import type { Env } from '../config/index.js';
import { PrismaService } from '../prisma/index.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { JwtPayload } from './strategies/jwt.strategy.js';

export interface GoogleProfile {
  googleId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

/** Returned by all auth endpoints — refresh token is sent via httpOnly cookie */
export interface AuthResult {
  accessToken: string;
  /** Raw refresh token — controller sets this as httpOnly cookie, never sent to client in body */
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });

    if (existing) {
      throw new ConflictException('Email or username already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        displayName: dto.displayName,
        passwordHash,
      },
    });

    return this.issueTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user);
  }

  async refresh(rawRefreshToken: string): Promise<AuthResult> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { revoked: false, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    let matched: (typeof tokens)[number] | undefined;

    for (const token of tokens) {
      const ok = await bcrypt.compare(rawRefreshToken, token.tokenHash);
      if (ok) {
        matched = token;
        break;
      }
    }

    if (!matched) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: matched.id },
      data: { revoked: true },
    });

    return this.issueTokens(matched.user);
  }

  async logout(userId: string, rawRefreshToken: string): Promise<void> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId, revoked: false },
    });

    for (const token of tokens) {
      const ok = await bcrypt.compare(rawRefreshToken, token.tokenHash);
      if (ok) {
        await this.prisma.refreshToken.update({
          where: { id: token.id },
          data: { revoked: true },
        });
        return;
      }
    }
  }

  async findOrCreateGoogleUser(profile: GoogleProfile): Promise<User> {
    const byGoogleId = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId },
    });
    if (byGoogleId) return byGoogleId;

    const byEmail = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });
    if (byEmail) {
      return this.prisma.user.update({
        where: { id: byEmail.id },
        data: { googleId: profile.googleId, avatarUrl: profile.avatarUrl },
      });
    }

    const baseUsername = profile.email
      .split('@')[0]
      .replace(/[^a-z0-9_]/gi, '_')
      .slice(0, 20);

    let finalUsername = baseUsername;
    let suffix = 1;
    while (await this.prisma.user.findUnique({ where: { username: finalUsername } })) {
      finalUsername = `${baseUsername}${String(suffix++)}`;
    }

    return this.prisma.user.create({
      data: {
        email: profile.email,
        username: finalUsername,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        googleId: profile.googleId,
      },
    });
  }

  async issueTokens(user: User): Promise<AuthResult> {
    const accessToken = this.signAccessToken(user);

    const rawToken = randomBytes(40).toString('hex');
    const tokenHash = await bcrypt.hash(rawToken, 10);

    const expiresInStr = this.config.get('JWT_REFRESH_EXPIRES_IN', { infer: true });
    const expiresAt = new Date(Date.now() + ms(expiresInStr as StringValue));

    await this.prisma.refreshToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    return { accessToken, refreshToken: rawToken };
  }

  private signAccessToken(user: User): string {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', { infer: true }),
    });
  }
}
