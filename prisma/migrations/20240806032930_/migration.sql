/*
  Warnings:

  - You are about to drop the column `packing_container_provision_id` on the `clothing_provisions` table. All the data in the column will be lost.
  - You are about to drop the column `packing_container_provision_id` on the `essential_provisions` table. All the data in the column will be lost.
  - You are about to drop the `packing_container_provisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `packing_containers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "clothing_provisions" DROP CONSTRAINT "clothing_provisions_packing_container_provision_id_fkey";

-- DropForeignKey
ALTER TABLE "essential_provisions" DROP CONSTRAINT "essential_provisions_packing_container_provision_id_fkey";

-- DropForeignKey
ALTER TABLE "packing_container_provisions" DROP CONSTRAINT "packing_container_provisions_luggage_provision_id_fkey";

-- DropForeignKey
ALTER TABLE "packing_container_provisions" DROP CONSTRAINT "packing_container_provisions_packing_container_id_fkey";

-- DropForeignKey
ALTER TABLE "packing_container_provisions" DROP CONSTRAINT "packing_container_provisions_trip_id_fkey";

-- DropForeignKey
ALTER TABLE "packing_containers" DROP CONSTRAINT "packing_containers_user_id_fkey";

-- AlterTable
ALTER TABLE "clothing_provisions" DROP COLUMN "packing_container_provision_id",
ADD COLUMN     "container_provision_id" TEXT;

-- AlterTable
ALTER TABLE "essential_provisions" DROP COLUMN "packing_container_provision_id",
ADD COLUMN     "container_provision_id" TEXT;

-- DropTable
DROP TABLE "packing_container_provisions";

-- DropTable
DROP TABLE "packing_containers";

-- CreateTable
CREATE TABLE "containers" (
    "id" TEXT NOT NULL,
    "order" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ContainerType" NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "containers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "container_provisions" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "container_id" TEXT NOT NULL,
    "luggage_provision_id" TEXT,
    "packed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "container_provisions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "containers" ADD CONSTRAINT "containers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothing_provisions" ADD CONSTRAINT "clothing_provisions_container_provision_id_fkey" FOREIGN KEY ("container_provision_id") REFERENCES "container_provisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essential_provisions" ADD CONSTRAINT "essential_provisions_container_provision_id_fkey" FOREIGN KEY ("container_provision_id") REFERENCES "container_provisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "container_provisions" ADD CONSTRAINT "container_provisions_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "container_provisions" ADD CONSTRAINT "container_provisions_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "containers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "container_provisions" ADD CONSTRAINT "container_provisions_luggage_provision_id_fkey" FOREIGN KEY ("luggage_provision_id") REFERENCES "luggage_provisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
