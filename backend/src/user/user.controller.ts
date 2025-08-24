import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FavoriteDto, UserDto } from './dto/user.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { User } from 'generated/prisma';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public getAll(
    @Query('seatch') searchQuery: string,
  ): Promise<Partial<User[]>> {
    return this.userService.getAll(searchQuery);
  }

  @Get('profile/:id')
  public getById(@Param('id') id: string): Promise<Partial<User>> {
    return this.userService.getById(id);
  }

  @Get('nickname/:nickname')
  public getByNickname(
    @Param('nickname') nickname: string,
  ): Promise<Partial<User>> {
    return this.userService.getByNickname(nickname);
  }

  @Put(':id')
  @Auth()
  public update(
    @Param('id') id: string,
    @Body() dto: UserDto,
  ): Promise<Partial<User>> {
    return this.userService.update(id, dto);
  }

  @Delete('favorite')
  @Auth()
  public removeFavorite(@Body() dto: FavoriteDto): Promise<boolean> {
    return this.userService.removeFavorite(dto);
  }

  @Post('favorite')
  @Auth()
  public createFavorite(@Body() dto: FavoriteDto): Promise<Partial<User>> {
    return this.userService.createFavorite(dto);
  }
}
