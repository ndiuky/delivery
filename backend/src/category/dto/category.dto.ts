import { IsString, Length } from 'class-validator';

export class CategoryDto {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsString()
  image: string;
}
