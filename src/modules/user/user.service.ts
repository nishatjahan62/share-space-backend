import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  isVerified: true,
  createdAt: true,
} as const;

export const getMe = async (userId: string) => {
  const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null }, select: userSelect });
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

export const updateMe = (userId: string, data: { name?: string; phone?: string | null }) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
    },
    select: userSelect,
  });