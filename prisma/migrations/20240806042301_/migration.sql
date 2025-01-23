/*
  Warnings:

  - You are about to drop the column `containerOrder` on the `clothing_provisions` table. All the data in the column will be lost.
  - You are about to drop the column `containerOrder` on the `essential_provisions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clothing_provisions" RENAME COLUMN "containerOrder" TO "container_order";


-- AlterTable
ALTER TABLE "essential_provisions" RENAME COLUMN "containerOrder" TO "container_order";
