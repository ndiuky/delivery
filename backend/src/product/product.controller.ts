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
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Product } from 'generated/prisma';
import { ProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Auth()
  public getAll(
    @Query('search') searchQuery: string,
  ): Promise<Partial<Product[]>> {
    return this.productService.getAll(searchQuery);
  }

  @Get('id/:id')
  @Auth()
  public getById(@Param('id') id: string): Promise<Partial<Product>> {
    return this.productService.getById(id);
  }

  @Get('slug/:slug')
  @Auth()
  public getBySlug(@Param('slug') slug: string): Promise<Partial<Product>> {
    return this.productService.getById(slug);
  }

  @Get('category/:slug')
  @Auth()
  public getByCategorySlug(
    @Param('slug') slug: string,
  ): Promise<Partial<Product[]>> {
    return this.productService.getByCategorySlug(slug);
  }

  @Post()
  @Auth()
  public create(@Body() dto: ProductDto): Promise<Partial<Product>> {
    return this.productService.create(dto);
  }

  @Put(':id')
  @Auth()
  public update(
    @Param('id') id: string,
    @Body() dto: ProductDto,
  ): Promise<Partial<Product>> {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @Auth()
  public delete(@Param('id') id: string): Promise<Partial<boolean>> {
    return this.productService.delete(id);
  }
}
