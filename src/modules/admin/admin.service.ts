import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { getPagination } from "../../utils/pagination.js";
import { logAction } from "../../utils/audit.js";

export const listUsers = async (page?: string, limit?: string) => {
  const { skip, take, pageNum, limitNum } = getPagination(page, limit);
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where: { deletedAt: null }, skip, take,
      select: { id: true, name: true, email: true, role: true, isVerified: true, createdAt: true },
    }),
    prisma.user.count({ where: { deletedAt: null } }),
  ]);
  return { items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } };
};

export const verifyUser = async (adminId: string, userId: string) => {
  const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
  if (!user) throw new ApiError(404, "User not found");

  const updated = await prisma.user.update({ where: { id: userId }, data: { isVerified: true } });
  await logAction(adminId, "VERIFY_USER", "User", userId);
  return updated;
};

export const getDashboardStats = async () => {
  const [totalUsers, totalOwners, totalTenants, totalProperties, totalRooms, occupiedRooms, totalRevenue] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { role: "OWNER", deletedAt: null } }),
    prisma.user.count({ where: { role: "TENANT", deletedAt: null } }),
    prisma.property.count({ where: { deletedAt: null } }),
    prisma.room.count({ where: { deletedAt: null } }),
    prisma.room.count({ where: { status: "OCCUPIED" } }),
    prisma.rentPayment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
  ]);

  return {
    totalUsers, totalOwners, totalTenants, totalProperties, totalRooms, occupiedRooms,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
};

export const getAuditLogs = async (page?: string, limit?: string) => {
  const { skip, take, pageNum, limitNum } = getPagination(page, limit);
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    prisma.auditLog.count(),
  ]);
  return { items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } };
};