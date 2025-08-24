import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FavoriteDto, UserDto } from './dto/user.dto';
import { ProductService } from 'src/product/product.service';
import { selectUserServiceFields } from './object/user.object';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly product: ProductService,
  ) {}

  public async getAll(searchQuery?: string): Promise<Partial<User[]>> {
    const users = searchQuery
      ? await this.search(searchQuery)
      : await this.prisma.user.findMany({
          select: selectUserServiceFields,
        });

    if (!users.length) throw new NotFoundException();

    return users;
  }

  public async getById(id: string): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: selectUserServiceFields,
    });

    if (!user) throw new NotFoundException();

    return user;
  }

  public async getByNickname(nickname: string): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
      select: selectUserServiceFields,
    });

    if (!user) throw new NotFoundException();

    return user;
  }

  public async createFavorite(dto: FavoriteDto): Promise<Partial<User>> {
    const { userId, productId } = dto;

    await this.getById(userId);

    await this.product.getById(productId);

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          connect: {
            id: productId,
          },
        },
      },
      select: selectUserServiceFields,
    });

    return user;
  }

  public async removeFavorite(dto: FavoriteDto): Promise<boolean> {
    const { userId, productId } = dto;

    await this.product.getById(productId);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          disconnect: {
            id: productId,
          },
        },
      },
    });

    return true;
  }

  public async update(id: string, dto: UserDto): Promise<Partial<User>> {
    const { firstName, lastName, nickname } = dto;

    let user = await this.getById(id);

    const existNickname = await this.verifyNickname(nickname);

    if (existNickname && user['nickname'] !== nickname)
      throw new BadRequestException('Nickname is exist');

    user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        nickname: nickname,
      },
      select: selectUserServiceFields,
    });

    return user;
  }

  private async search(search: string): Promise<Partial<User[]>> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            nickname: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: selectUserServiceFields,
    });

    return users;
  }

  private async verifyNickname(nickname: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });

    return user ? true : false;
  }
}
