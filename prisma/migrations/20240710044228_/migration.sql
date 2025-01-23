/*
  Warnings:

  - Added the required column `aaguid` to the `passkeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passkeys" ADD COLUMN     "aaguid" TEXT NOT NULL;
