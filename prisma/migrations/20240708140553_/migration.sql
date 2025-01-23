-- AlterTable
ALTER TABLE "clothing_provisions" ADD COLUMN     "packing_container_provision_id" TEXT;

-- AlterTable
ALTER TABLE "essential_provisions" ADD COLUMN     "packing_container_provision_id" TEXT;

-- CreateTable
CREATE TABLE "packing_container_provisions" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "packing_container_id" TEXT NOT NULL,
    "luggage_provision_id" TEXT,

    CONSTRAINT "packing_container_provisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "luggage_provisions" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "luggage_id" TEXT NOT NULL,

    CONSTRAINT "luggage_provisions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clothing_provisions" ADD CONSTRAINT "clothing_provisions_packing_container_provision_id_fkey" FOREIGN KEY ("packing_container_provision_id") REFERENCES "packing_container_provisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essential_provisions" ADD CONSTRAINT "essential_provisions_packing_container_provision_id_fkey" FOREIGN KEY ("packing_container_provision_id") REFERENCES "packing_container_provisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packing_container_provisions" ADD CONSTRAINT "packing_container_provisions_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packing_container_provisions" ADD CONSTRAINT "packing_container_provisions_packing_container_id_fkey" FOREIGN KEY ("packing_container_id") REFERENCES "packing_containers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packing_container_provisions" ADD CONSTRAINT "packing_container_provisions_luggage_provision_id_fkey" FOREIGN KEY ("luggage_provision_id") REFERENCES "luggage_provisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luggage_provisions" ADD CONSTRAINT "luggage_provisions_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luggage_provisions" ADD CONSTRAINT "luggage_provisions_luggage_id_fkey" FOREIGN KEY ("luggage_id") REFERENCES "luggage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
