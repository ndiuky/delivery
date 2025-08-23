import { Prisma } from 'generated/prisma';

export const selectCategoryFields: Prisma.CategorySelect = {
  id: true,
  name: true,
  slug: true,
  image: true,
};
