import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export const createUtilityBill = async (roomId: string, ownerId: string, data: { type: string; amount: number; billingMonth: string }) => {
  const room = await prisma.room.findFirst({ where: { id: roomId, deletedAt: null }, include: { property: true } });
  if (!room) throw new ApiError(404, "Room not found");
  if (room.property.ownerId !== ownerId) throw new ApiError(403, "Not your property");

  const activeTenancies = await prisma.tenancy.findMany({ where: { roomId, status: "ACTIVE" } });
  if (activeTenancies.length === 0) throw new ApiError(400, "No active tenants to split the bill with");

  // Create bill + even splits atomically — every tenant gets exactly one share, no partial state
  return prisma.$transaction(async (tx) => {
    const bill = await tx.utilityBill.create({
      data: { roomId, type: data.type as never, amount: data.amount, billingMonth: data.billingMonth },
    });

    const shareAmount = Math.floor(data.amount / activeTenancies.length);
    await tx.billSplit.createMany({
      data: activeTenancies.map((t) => ({ utilityBillId: bill.id, tenantId: t.tenantId, shareAmount })),
    });

    return bill;
  });
};

export const getBillSplits = async (utilityBillId: string) => {
  const bill = await prisma.utilityBill.findUnique({ where: { id: utilityBillId } });
  if (!bill) throw new ApiError(404, "Utility bill not found");
  return prisma.billSplit.findMany({ where: { utilityBillId }, include: { tenant: { select: { id: true, name: true } } } });
};

export const markSplitPaid = async (splitId: string, tenantId: string) => {
  const split = await prisma.billSplit.findUnique({ where: { id: splitId } });
  if (!split) throw new ApiError(404, "Bill split not found");
  if (split.tenantId !== tenantId) throw new ApiError(403, "Not your bill share");
  return prisma.billSplit.update({ where: { id: splitId }, data: { status: "PAID" } });
};