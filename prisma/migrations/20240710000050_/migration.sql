-- CreateTable
CREATE TABLE "passkeys" (
    "id" TEXT NOT NULL,
    "public_key" BYTEA NOT NULL,
    "user_id" TEXT NOT NULL,
    "webauthn_user_id" TEXT NOT NULL,
    "counter" BIGINT NOT NULL,
    "device_type" TEXT NOT NULL,
    "backed_up" BOOLEAN NOT NULL,
    "transports" TEXT NOT NULL,

    CONSTRAINT "passkeys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
