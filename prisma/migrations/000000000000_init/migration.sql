-- CreateEnum
CREATE TYPE "ClothingCategory" AS ENUM ('Top', 'Bottom', 'Accessory');

-- CreateEnum
CREATE TYPE "EssentialCategory" AS ENUM ('Toiletry', 'Electronic', 'Document');

-- CreateEnum
CREATE TYPE "TripMode" AS ENUM ('Provision', 'Pack', 'Audit');

-- CreateTable
CREATE TABLE "clothing_types" (
    "name" TEXT NOT NULL,
    "category" "ClothingCategory" NOT NULL,

    CONSTRAINT "clothing_types_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "brands" (
    "name" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "clothes" (
    "id" TEXT NOT NULL,
    "brand_name" TEXT NOT NULL,
    "brand_line" TEXT,
    "color" TEXT NOT NULL,
    "number" INTEGER,
    "modifier" TEXT,
    "type_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "clothes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "mode" "TripMode" NOT NULL DEFAULT 'Provision',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clothing_provisions" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "trip_id" TEXT NOT NULL,
    "clothing_id" TEXT NOT NULL,

    CONSTRAINT "clothing_provisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "essential_provisions" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "essential_id" TEXT NOT NULL,

    CONSTRAINT "essential_provisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "essentials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" "EssentialCategory" NOT NULL,

    CONSTRAINT "essentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clothes_brand_name_brand_line_color_type_name_number_modifi_key" ON "clothes"("brand_name", "brand_line", "color", "type_name", "number", "modifier");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "clothes" ADD CONSTRAINT "clothes_brand_name_fkey" FOREIGN KEY ("brand_name") REFERENCES "brands"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothes" ADD CONSTRAINT "clothes_type_name_fkey" FOREIGN KEY ("type_name") REFERENCES "clothing_types"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothes" ADD CONSTRAINT "clothes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothing_provisions" ADD CONSTRAINT "clothing_provisions_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothing_provisions" ADD CONSTRAINT "clothing_provisions_clothing_id_fkey" FOREIGN KEY ("clothing_id") REFERENCES "clothes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essential_provisions" ADD CONSTRAINT "essential_provisions_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essential_provisions" ADD CONSTRAINT "essential_provisions_essential_id_fkey" FOREIGN KEY ("essential_id") REFERENCES "essentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "essentials" ADD CONSTRAINT "essentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

