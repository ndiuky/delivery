import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto, LoginDto, UpdateTokenDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from 'generated/prisma';
import { hash, verify } from 'argon2';
import { selectUserFields } from './object/auth.select';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  public async register(dto: RegisterDto): Promise<{
    user: Partial<User>;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const { firstName, lastName, nickname, email, password } = dto;

    const existUser = await this.verifyEmail(email);

    if (existUser) throw new BadRequestException('Email already exist');

    const hashedPassword = await hash(password);

    const user = await this.prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        nickname: nickname,
        password: hashedPassword,
      },
      select: selectUserFields,
    });

    const tokens = this.generateTokens(user['id']);

    return { user: user, tokens: tokens };
  }

  public async login(dto: LoginDto): Promise<{
    user: Partial<User>;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new BadRequestException('Email is not exist');

    const isValid = await verify(user['password'], password);

    if (!isValid) throw new UnauthorizedException('Password is wrong');

    const tokens = this.generateTokens(user['id']);

    const filtredUserFirlds = Object.fromEntries(
      Object.entries(user).filter(([key]) => selectUserFields[key]),
    );

    return { user: filtredUserFirlds, tokens: tokens };
  }

  public async updateTokens(dto: UpdateTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { refreshToken } = dto;

    const result = await this.jwt.verifyAsync(refreshToken).catch(() => {
      throw new UnauthorizedException('Invalid refresh token');
    });

    if (!result || !result['id'])
      throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const tokens = this.generateTokens(user['id']);

    return tokens;
  }

  private async verifyEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user ? true : false;
  }

  private generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
