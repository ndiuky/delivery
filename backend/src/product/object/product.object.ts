import { Prisma } from 'generated/prisma';
import { selectCategoryFields } from 'src/category/object/category.select';

export const selectProductFields: Prisma.ProductSelect = {
  id: true,
  name: true,
  slug: true,
  image: true,
  isAvailable: true,
  category: {
    select: selectCategoryFields,
  },
};
