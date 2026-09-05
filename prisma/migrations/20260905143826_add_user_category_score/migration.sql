-- CreateTable
CREATE TABLE "UserCategoryScore" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "userId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "categoryScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCategoryScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCategoryScore_userId_categoryId_key" ON "UserCategoryScore"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "UserCategoryScore" ADD CONSTRAINT "UserCategoryScore_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCategoryScore" ADD CONSTRAINT "UserCategoryScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
