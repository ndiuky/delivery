import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { selectCategoryFields } from './object/category.select';
import { CategoryDto } from './dto/category.dto';
import slug from 'slug';

@Injectable()
export class CategoryService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getAll(searchQuery?: string): Promise<Partial<Category[]>> {
    const categories = searchQuery
      ? await this.search(searchQuery)
      : await this.prisma.category.findMany({
          select: selectCategoryFields,
        });

    if (!categories.length) throw new NotFoundException();

    return categories;
  }

  public async getById(id: string): Promise<Partial<Category>> {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
      select: selectCategoryFields,
    });

    if (!category) throw new NotFoundException();

    return category;
  }

  public async getBySlug(slug: string): Promise<Partial<Category>> {
    const category = await this.prisma.category.findUnique({
      where: {
        slug: slug,
      },
      select: selectCategoryFields,
    });

    if (!category) throw new NotFoundException();

    return category;
  }

  public async create(dto: CategoryDto): Promise<Partial<Category>> {
    const { name, image } = dto;

    const categorySlug = slug(name);

    const existCategory = await this.verifySlug(categorySlug);

    if (existCategory) throw new BadRequestException('Name already exist');

    if (image) {
      const category = await this.prisma.category.create({
        data: {
          name: name,
          slug: categorySlug,
          image: image,
        },
        select: selectCategoryFields,
      });

      return category;
    }

    const category = await this.prisma.category.create({
      data: {
        name: name,
        slug: categorySlug,
      },
      select: selectCategoryFields,
    });

    return category;
  }

  public async update(
    id: string,
    dto: CategoryDto,
  ): Promise<Partial<Category>> {
    const { name, image } = dto;

    let category = await this.getById(id);

    const categorySlug = slug(name);

    if (category['slug'] !== categorySlug) {
      const existSlug = await this.verifySlug(categorySlug);

      if (existSlug) throw new BadRequestException('Slug already exist');

      category = await this.prisma.category.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          slug: categorySlug,
          image: image,
        },
        select: selectCategoryFields,
      });

      return category;
    }

    category = await this.prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        image: image,
      },
      select: selectCategoryFields,
    });

    return category;
  }

  public async delete(id: string): Promise<boolean> {
    await this.getById(id);

    await this.prisma.category.delete({
      where: {
        id: id,
      },
    });

    return true;
  }

  private async search(searchQuery: string): Promise<Partial<Category[]>> {
    const catgories = await this.prisma.category.findMany({
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
        ],
      },
      select: selectCategoryFields,
    });

    return catgories;
  }

  private async verifySlug(slug: string): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { slug: slug },
    });

    return category ? true : false;
  }
}
