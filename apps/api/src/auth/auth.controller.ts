import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import type { User } from '@prisma/client';
import { CurrentUser, Public } from '../common/decorators/index.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<{ accessToken: string }> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(dto);
  }

  @Get('me')
  me(@CurrentUser() user: User): Omit<User, 'passwordHash'> {
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
