-- AlterTable
ALTER TABLE "clothing_provisions" ADD COLUMN     "packed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "essential_provisions" ADD COLUMN     "packed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "packing_container_provisions" ADD COLUMN     "packed" BOOLEAN NOT NULL DEFAULT false;
