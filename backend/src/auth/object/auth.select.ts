import type { Prisma } from 'generated/prisma';

export const selectUserFields: Prisma.UserSelect = {
  id: true,
  createdAt: true,
  firstName: true,
  lastName: true,
  avatar: true,
  email: true,
  nickname: true,
};
