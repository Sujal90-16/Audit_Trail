-- CreateTable
CREATE TABLE "ShipmentReadModel" (
    "aggregateId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" TEXT,
    "location" TEXT,
    "containerNumber" TEXT,
    "shipName" TEXT,
    "port" TEXT,
    "deliveredAt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipmentReadModel_pkey" PRIMARY KEY ("aggregateId")
);

-- CreateIndex
CREATE INDEX "ShipmentReadModel_status_idx" ON "ShipmentReadModel"("status");

-- CreateIndex
CREATE INDEX "ShipmentReadModel_location_idx" ON "ShipmentReadModel"("location");
