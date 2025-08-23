import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class ProductDto {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  image: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;

  @IsInt()
  @IsNotEmpty()
  price: number;
}
