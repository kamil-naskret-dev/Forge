import {
  Controller,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import type { User } from '@prisma/client';
import type { CookieOptions, Request, Response } from 'express';
import ms, { type StringValue } from 'ms';
import type { Env } from '../config/index.js';
import { CurrentUser, Public } from '../common/decorators/index.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const REFRESH_COOKIE = 'refresh_token';

@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions;

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<Env, true>,
  ) {
    const expiresIn = this.config.get('JWT_REFRESH_EXPIRES_IN', { infer: true });
    const isProduction = this.config.get('NODE_ENV', { infer: true }) === 'production';

    this.cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: ms(expiresIn as StringValue),
      path: '/',
    };
  }

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.register(dto);
    res.cookie(REFRESH_COOKIE, refreshToken, this.cookieOptions);
    return { accessToken };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    res.cookie(REFRESH_COOKIE, refreshToken, this.cookieOptions);
    return { accessToken };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const token = (req.cookies as Record<string, string | undefined>)[REFRESH_COOKIE];

    if (!token) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const { accessToken, refreshToken } = await this.authService.refresh(token);
    res.cookie(REFRESH_COOKIE, refreshToken, this.cookieOptions);
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = (req.cookies as Record<string, string | undefined>)[REFRESH_COOKIE];
    if (token) {
      await this.authService.logout(user.id, token);
    }
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google')
  googleLogin(): void {
    // Passport redirects to Google — body intentionally empty
  }

  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  @Redirect()
  async googleCallback(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ url: string }> {
    const { accessToken, refreshToken } = await this.authService.issueTokens(user);
    res.cookie(REFRESH_COOKIE, refreshToken, this.cookieOptions);

    const frontendUrl = this.config.get('FRONTEND_URL', { infer: true });
    return { url: `${frontendUrl}/auth/callback?accessToken=${accessToken}` };
  }

  @Get('me')
  me(@CurrentUser() user: User): Omit<User, 'passwordHash'> {
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
