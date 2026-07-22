import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import type { User } from '@prisma/client';
import { CurrentUser, Public } from '../common/decorators/index.js';
import type { AuthTokens } from './auth.service.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<AuthTokens> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<AuthTokens> {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto): Promise<AuthTokens> {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser() user: User, @Body() dto: RefreshDto): Promise<void> {
    return this.authService.logout(user.id, dto.refreshToken);
  }

  @Get('me')
  me(@CurrentUser() user: User): Omit<User, 'passwordHash'> {
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
