-- CreateTable
CREATE TABLE "Missing" (
    "id" SERIAL NOT NULL,
    "song_name" TEXT NOT NULL,
    "diff" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Missing_pkey" PRIMARY KEY ("id")
);
