/*
  Warnings:

  - You are about to drop the column `backed_up` on the `passkeys` table. All the data in the column will be lost.
  - You are about to drop the column `device_type` on the `passkeys` table. All the data in the column will be lost.
  - You are about to alter the column `counter` on the `passkeys` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "passkeys" DROP COLUMN "backed_up",
DROP COLUMN "device_type",
ALTER COLUMN "counter" SET DATA TYPE INTEGER;
