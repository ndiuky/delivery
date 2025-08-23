import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from 'generated/prisma';
import { selectProductFields } from './object/product.object';
import { PrismaService } from 'src/prisma.service';
import { CategoryService } from 'src/category/category.service';
import { ProductDto } from './dto/product.dto';
import slug from 'slug';

@Injectable()
export class ProductService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly category: CategoryService,
  ) {}

  public async getAll(searchQuery?: string): Promise<Partial<Product[]>> {
    const products = searchQuery
      ? await this.search(searchQuery)
      : await this.prisma.product.findMany({
          select: selectProductFields,
        });

    if (!products.length) throw new NotFoundException();

    return products;
  }

  public async getById(id: string): Promise<Partial<Product>> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: id,
      },
      select: selectProductFields,
    });

    if (!product) throw new NotFoundException();

    return product;
  }

  public async getBySlug(slug: string): Promise<Partial<Product>> {
    const product = await this.prisma.product.findUnique({
      where: {
        slug: slug,
      },
      select: selectProductFields,
    });

    if (!product) throw new NotFoundException();

    return product;
  }

  public async getByCategorySlug(
    categorySlug: string,
  ): Promise<Partial<Product[]>> {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      select: selectProductFields,
    });

    if (!products.length) throw new NotFoundException();

    return products;
  }

  public async create(dto: ProductDto): Promise<Partial<Product>> {
    const { name, description, image, categoryId, isAvailable, price } = dto;

    await this.category.getById(categoryId);

    const productSlug = slug(name);

    const existProduct = await this.verifySlug(productSlug);

    if (existProduct) throw new BadRequestException('Name already exist');

    if (image) {
      const product = await this.prisma.product.create({
        data: {
          name: name,
          description: description,
          slug: productSlug,
          category: {
            connect: {
              id: categoryId,
            },
          },
          isAvailable: isAvailable,
          image: image,
          price: price,
        },
        select: selectProductFields,
      });

      return product;
    }

    const product = await this.prisma.product.create({
      data: {
        name: name,
        description: description,
        slug: productSlug,
        category: {
          connect: {
            id: categoryId,
          },
        },
        isAvailable: isAvailable,
        image: image,
        price: price,
      },
      select: selectProductFields,
    });

    return product;
  }

  public async update(id: string, dto: ProductDto): Promise<Partial<Product>> {
    const { name, description, image, categoryId, isAvailable, price } = dto;

    await this.category.getById(categoryId);

    let product = await this.getById(id);

    const productSlug = slug(name);

    if (product['slug'] !== productSlug) {
      const existSlug = await this.verifySlug(productSlug);

      if (existSlug) throw new BadRequestException('Slug already exist');

      product = await this.prisma.product.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          description: description,
          slug: productSlug,
          category: {
            connect: {
              id: categoryId,
            },
          },
          isAvailable: isAvailable,
          image: image,
          price: price,
        },
        select: selectProductFields,
      });

      return product;
    }

    product = await this.prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        description: description,
        slug: productSlug,
        category: {
          connect: {
            id: categoryId,
          },
        },
        isAvailable: isAvailable,
        image: image,
        price: price,
      },
      select: selectProductFields,
    });

    return product;
  }

  public async delete(id: string): Promise<boolean> {
    await this.getById(id);

    await this.prisma.product.delete({
      where: {
        id: id,
      },
    });

    return true;
  }

  private async search(searchQuery: string): Promise<Partial<Product[]>> {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            slug: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: selectProductFields,
    });

    return products;
  }

  private async verifySlug(slug: string): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { slug: slug },
    });

    return product ? true : false;
  }
}
