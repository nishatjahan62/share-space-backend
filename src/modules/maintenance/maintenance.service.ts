import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const createRequest = (tenantId: string, data: { roomId: string; title: string; description: string; priority: "LOW" | "MEDIUM" | "HIGH" }) =>
  prisma.maintenanceRequest.create({ data: { ...data, tenantId } });

export const getMyRequests = (tenantId: string) =>
  prisma.maintenanceRequest.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } });

export const updateStatus = async (id: string, ownerId: string, status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: { room: { include: { property: true } } },
  });
  if (!request) throw new ApiError(404, "Maintenance request not found");
  if (request.room.property.ownerId !== ownerId) throw new ApiError(403, "Not your property");

  return prisma.maintenanceRequest.update({ where: { id }, data: { status } });
};