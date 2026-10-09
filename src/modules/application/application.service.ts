import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const createApplication = async (tenantId: string, roomId: string, moveInDate: string, message?: string) => {
  const room = await prisma.room.findFirst({ where: { id: roomId, deletedAt: null } });
  if (!room) throw new ApiError(404, "Room not found");
  if (room.status !== "AVAILABLE") throw new ApiError(400, "Room is not available");

  return prisma.application.create({
    data: { roomId, tenantId, moveInDate: new Date(moveInDate), message: message ?? null },
  });
};

export const getMyApplications = (tenantId: string) =>
  prisma.application.findMany({ where: { tenantId }, include: { room: true } });

export const approveApplication = async (applicationId: string, ownerId: string) => {
  return prisma.$transaction(async (tx) => {
    const application = await tx.application.findUnique({
      where: { id: applicationId },
      include: { room: { include: { property: true } } },
    });
    if (!application) throw new ApiError(404, "Application not found");
    if (application.room.property.ownerId !== ownerId) throw new ApiError(403, "Not your property");
    if (application.status !== "PENDING") throw new ApiError(400, "Application already reviewed");

    const room = await tx.room.findUnique({ where: { id: application.roomId } });
    if (!room) throw new ApiError(404, "Room not found");
    if (room.currentOccupancy >= room.capacity) {
      throw new ApiError(409, "Room is already full — cannot approve");
    }

    const updatedApplication = await tx.application.update({
      where: { id: applicationId },
      data: { status: "APPROVED" },
    });

    const tenancy = await tx.tenancy.create({
      data: {
        roomId: room.id,
        tenantId: application.tenantId,
        startDate: application.moveInDate,
        monthlyRent: room.rentAmount,
      },
    });

    await tx.rentPayment.create({
      data: { tenancyId: tenancy.id, amount: room.rentAmount, dueDate: application.moveInDate },
    });

    const newOccupancy = room.currentOccupancy + 1;
    await tx.room.update({
      where: { id: room.id },
      data: {
        currentOccupancy: newOccupancy,
        status: newOccupancy >= room.capacity ? "OCCUPIED" : "AVAILABLE",
      },
    });

    return { application: updatedApplication, tenancy };
  });
};

export const rejectApplication = async (applicationId: string, ownerId: string) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { room: { include: { property: true } } },
  });
  if (!application) throw new ApiError(404, "Application not found");
  if (application.room.property.ownerId !== ownerId) throw new ApiError(403, "Not your property");
  if (application.status !== "PENDING") throw new ApiError(400, "Application already reviewed");

  return prisma.application.update({ where: { id: applicationId }, data: { status: "REJECTED" } });
};