import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UpdateTokenDto } from './dto/auth.dto';
import type { User } from 'generated/prisma';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public register(@Body() dto: RegisterDto): Promise<{
    user: Partial<User>;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    return this.authService.register(dto);
  }

  @Post('login')
  public login(@Body() dto: LoginDto): Promise<{
    user: Partial<User>;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    return this.authService.login(dto);
  }

  @Post('token')
  public updateToken(@Body() dto: UpdateTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.updateTokens(dto);
  }
}
