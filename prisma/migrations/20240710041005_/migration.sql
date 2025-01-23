/*
  Warnings:

  - Added the required column `lastUsed` to the `passkeys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `passkeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passkeys" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastUsed" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
