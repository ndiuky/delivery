import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class UserDto {
  @IsString()
  @Length(3, 20)
  firstName: string;

  @IsString()
  @Length(3, 20)
  lastName: string;

  @IsString()
  @Length(5, 15)
  nickname: string;
}

export class FavoriteDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
