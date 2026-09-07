import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { getPagination } from "../../utils/pagination.js";

export const createProperty = (ownerId: string, data: { title: string; address: string; city: string; description?: string }) =>
  prisma.property.create({ data: { ...data, ownerId } });

export const listProperties = async (query: {
  page?: string; limit?: string; city?: string; minRent?: string; maxRent?: string; sortBy?: string;
}) => {
  const { skip, take, pageNum, limitNum } = getPagination(query.page, query.limit);

  const where = {
    deletedAt: null,
    ...(query.city && { city: { equals: query.city, mode: "insensitive" as const } }),
    ...(query.minRent || query.maxRent
      ? { rooms: { some: {
          rentAmount: {
            ...(query.minRent && { gte: Number(query.minRent) }),
            ...(query.maxRent && { lte: Number(query.maxRent) }),
          },
        } } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where, skip, take,
      orderBy: { [query.sortBy || "createdAt"]: "desc" },
      include: { rooms: true },
    }),
    prisma.property.count({ where }),
  ]);

  return { items, meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } };
};

export const getPropertyById = async (id: string) => {
  const property = await prisma.property.findFirst({ where: { id, deletedAt: null }, include: { rooms: true } });
  if (!property) throw new ApiError(404, "Property not found");
  return property;
};

export const updateProperty = async (id: string, ownerId: string, data: Partial<{ title: string; address: string; city: string; description: string }>) => {
  const property = await getPropertyById(id);
  if (property.ownerId !== ownerId) throw new ApiError(403, "You do not own this property");
  return prisma.property.update({ where: { id }, data });
};

export const deleteProperty = async (id: string, ownerId: string) => {
  const property = await getPropertyById(id);
  if (property.ownerId !== ownerId) throw new ApiError(403, "You do not own this property");
  return prisma.property.update({ where: { id }, data: { deletedAt: new Date() } });
};

export const searchProperties = (q: string) =>
  prisma.property.findMany({
    where: {
      deletedAt: null,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
      ],
    },
    include: { rooms: true },
  });