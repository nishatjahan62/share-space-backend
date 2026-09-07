import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const createRoom = async (propertyId: string, ownerId: string, data: { roomNumber: string; rentAmount: number; capacity: number }) => {
  const property = await prisma.property.findFirst({ where: { id: propertyId, deletedAt: null } });
  if (!property) throw new ApiError(404, "Property not found");
  if (property.ownerId !== ownerId) throw new ApiError(403, "You do not own this property");

  return prisma.room.create({ data: { ...data, propertyId } });
};

export const getRoomById = async (id: string) => {
  const room = await prisma.room.findFirst({ where: { id, deletedAt: null }, include: { property: true } });
  if (!room) throw new ApiError(404, "Room not found");
  return room;
};

export const updateRoom = async (id: string, ownerId: string, data: Partial<{ roomNumber: string; rentAmount: number; capacity: number }>) => {
  const room = await getRoomById(id);
  if (room.property.ownerId !== ownerId) throw new ApiError(403, "You do not own this room");
  return prisma.room.update({ where: { id }, data });
};

export const updateAvailability = async (id: string, ownerId: string, status: "AVAILABLE" | "OCCUPIED" | "RESERVED") => {
  const room = await getRoomById(id);
  if (room.property.ownerId !== ownerId) throw new ApiError(403, "You do not own this room");
  return prisma.room.update({ where: { id }, data: { status } });
};