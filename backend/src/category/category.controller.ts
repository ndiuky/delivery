import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'generated/prisma';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Auth()
  public getAll(
    @Query('search') searchQuery: string,
  ): Promise<Partial<Category[]>> {
    return this.categoryService.getAll(searchQuery);
  }

  @Get('id/:id')
  @Auth()
  public getById(@Param('id') id: string): Promise<Partial<Category>> {
    return this.categoryService.getById(id);
  }

  @Get('slug/:slug')
  @Auth()
  public getBySlug(@Param('slug') slug: string): Promise<Partial<Category>> {
    return this.categoryService.getById(slug);
  }

  @Post()
  @Auth()
  public create(@Body() dto: CategoryDto): Promise<Partial<Category>> {
    return this.categoryService.create(dto);
  }

  @Put(':id')
  @Auth()
  public update(
    @Param('id') id: string,
    @Body() dto: CategoryDto,
  ): Promise<Partial<Category>> {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @Auth()
  public delete(@Param('id') id: string): Promise<Partial<boolean>> {
    return this.categoryService.delete(id);
  }
}
