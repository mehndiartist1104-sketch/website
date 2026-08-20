-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN "heroImageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "SiteConfig"
SET "heroImageUrls" = ARRAY["heroImageUrl"]
WHERE "heroImageUrl" IS NOT NULL AND "heroImageUrl" <> '' AND cardinality("heroImageUrls") = 0;
