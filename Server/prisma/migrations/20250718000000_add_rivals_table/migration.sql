-- CreateTable
CREATE TABLE "Rival" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "rivalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rival_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rival" ADD CONSTRAINT "Rival_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Rival" ADD CONSTRAINT "Rival_rivalId_fkey" FOREIGN KEY ("rivalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Rival_userId_rivalId_key" ON "Rival"("userId", "rivalId");
