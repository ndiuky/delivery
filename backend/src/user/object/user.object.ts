import { Prisma } from 'generated/prisma';
import { selectUserFields } from 'src/auth/object/auth.select';
import { selectProductFields } from 'src/product/object/product.object';

export const selectUserServiceFields: Prisma.UserSelect = {
  ...selectUserFields,
  favorites: {
    select: selectProductFields,
  },
};
