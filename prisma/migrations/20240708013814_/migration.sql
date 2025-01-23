/*
  Warnings:

  - You are about to drop the `Luggage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackingContainer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Luggage";

-- DropTable
DROP TABLE "PackingContainer";

-- CreateTable
CREATE TABLE "packing_containers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ContainerType" NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "packing_containers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "luggage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "luggage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "packing_containers" ADD CONSTRAINT "packing_containers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "luggage" ADD CONSTRAINT "luggage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
