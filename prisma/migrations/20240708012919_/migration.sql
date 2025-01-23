-- CreateEnum
CREATE TYPE "ContainerType" AS ENUM ('Clothes', 'Essentials');

-- CreateTable
CREATE TABLE "PackingContainer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ContainerType" NOT NULL,

    CONSTRAINT "PackingContainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Luggage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Luggage_pkey" PRIMARY KEY ("id")
);
