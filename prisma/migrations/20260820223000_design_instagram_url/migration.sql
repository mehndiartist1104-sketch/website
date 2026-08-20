-- AlterTable
ALTER TABLE "Design" ADD COLUMN "instagramUrl" TEXT NOT NULL DEFAULT 'https://www.instagram.com/shikha.s_mehndi_art';

UPDATE "Design" SET "instagramUrl" = 'https://www.instagram.com/shikha.s_mehndi_art';

UPDATE "SiteConfig" SET "instagramUrl" = 'https://www.instagram.com/shikha.s_mehndi_art' WHERE "id" = 1;
