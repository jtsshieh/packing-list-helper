/*
  Warnings:

  - Added the required column `order` to the `essential_provisions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "essential_provisions" ADD COLUMN     "order" TEXT NOT NULL;
