/*
  Warnings:

  - A unique constraint covering the columns `[credential_id]` on the table `passkeys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `credential_id` to the `passkeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passkeys" ADD COLUMN     "credential_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "passkeys_credential_id_key" ON "passkeys"("credential_id");
