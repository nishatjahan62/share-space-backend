import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const createViewingRequest = async (tenantId: string, roomId: string, requestedDate: string) => {
  const room = await prisma.room.findFirst({ where: { id: roomId, deletedAt: null } });
  if (!room) throw new ApiError(404, "Room not found");

  return prisma.viewingRequest.create({
    data: { roomId, tenantId, requestedDate: new Date(requestedDate) },
  });
};

export const updateViewingStatus = async (id: string, ownerId: string, status: "CONFIRMED" | "REJECTED" | "COMPLETED") => {
  const viewing = await prisma.viewingRequest.findUnique({
    where: { id },
    include: { room: { include: { property: true } } },
  });
  if (!viewing) throw new ApiError(404, "Viewing request not found");
  if (viewing.room.property.ownerId !== ownerId) throw new ApiError(403, "Not your property");

  return prisma.viewingRequest.update({ where: { id }, data: { status } });
};