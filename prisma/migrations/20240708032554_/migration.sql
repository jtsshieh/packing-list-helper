/*
  Warnings:

  - Added the required column `order` to the `luggage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `packing_containers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "luggage" ADD COLUMN     "order" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "packing_containers" ADD COLUMN     "order" TEXT NOT NULL;
