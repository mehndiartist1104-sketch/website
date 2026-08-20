-- AlterTable
ALTER TABLE "Design" ALTER COLUMN "category" TYPE TEXT USING "category"::text;

-- DropEnum
DROP TYPE "DesignCategory";
