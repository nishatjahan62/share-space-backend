-- CreateEnum
CREATE TYPE "BillType" AS ENUM ('ELECTRICITY', 'WATER', 'GAS', 'INTERNET');

-- CreateEnum
CREATE TYPE "SplitStatus" AS ENUM ('PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "MaintenancePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "UtilityBill" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "type" "BillType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "billingMonth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UtilityBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillSplit" (
    "id" TEXT NOT NULL,
    "utilityBillId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "shareAmount" INTEGER NOT NULL,
    "status" "SplitStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "BillSplit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRequest" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "MaintenancePriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UtilityBill_roomId_idx" ON "UtilityBill"("roomId");

-- CreateIndex
CREATE INDEX "BillSplit_utilityBillId_idx" ON "BillSplit"("utilityBillId");

-- CreateIndex
CREATE INDEX "BillSplit_tenantId_idx" ON "BillSplit"("tenantId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_roomId_idx" ON "MaintenanceRequest"("roomId");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_status_idx" ON "MaintenanceRequest"("status");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "UtilityBill" ADD CONSTRAINT "UtilityBill_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillSplit" ADD CONSTRAINT "BillSplit_utilityBillId_fkey" FOREIGN KEY ("utilityBillId") REFERENCES "UtilityBill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillSplit" ADD CONSTRAINT "BillSplit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
