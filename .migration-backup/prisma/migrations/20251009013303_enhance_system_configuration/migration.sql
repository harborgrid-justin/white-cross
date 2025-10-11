-- CreateEnum
CREATE TYPE "ConfigValueType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'ARRAY', 'DATE', 'TIME', 'DATETIME', 'EMAIL', 'URL', 'COLOR', 'ENUM');

-- CreateEnum
CREATE TYPE "ConfigScope" AS ENUM ('SYSTEM', 'DISTRICT', 'SCHOOL', 'USER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ConfigCategory" ADD VALUE 'HEALTHCARE';
ALTER TYPE "ConfigCategory" ADD VALUE 'MEDICATION';
ALTER TYPE "ConfigCategory" ADD VALUE 'APPOINTMENTS';
ALTER TYPE "ConfigCategory" ADD VALUE 'UI';
ALTER TYPE "ConfigCategory" ADD VALUE 'QUERY';
ALTER TYPE "ConfigCategory" ADD VALUE 'FILE_UPLOAD';
ALTER TYPE "ConfigCategory" ADD VALUE 'RATE_LIMITING';
ALTER TYPE "ConfigCategory" ADD VALUE 'SESSION';
ALTER TYPE "ConfigCategory" ADD VALUE 'EMAIL';
ALTER TYPE "ConfigCategory" ADD VALUE 'SMS';

-- AlterTable
ALTER TABLE "system_configurations" ADD COLUMN     "defaultValue" TEXT,
ADD COLUMN     "isEditable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxValue" DOUBLE PRECISION,
ADD COLUMN     "minValue" DOUBLE PRECISION,
ADD COLUMN     "requiresRestart" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scope" "ConfigScope" NOT NULL DEFAULT 'SYSTEM',
ADD COLUMN     "scopeId" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subCategory" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "validValues" TEXT[],
ADD COLUMN     "valueType" "ConfigValueType" NOT NULL DEFAULT 'STRING';

-- CreateTable
CREATE TABLE "configuration_history" (
    "id" TEXT NOT NULL,
    "configKey" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedByName" TEXT,
    "changeReason" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "configurationId" TEXT NOT NULL,

    CONSTRAINT "configuration_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "configuration_history_configKey_createdAt_idx" ON "configuration_history"("configKey", "createdAt");

-- CreateIndex
CREATE INDEX "configuration_history_changedBy_createdAt_idx" ON "configuration_history"("changedBy", "createdAt");

-- CreateIndex
CREATE INDEX "configuration_history_configurationId_createdAt_idx" ON "configuration_history"("configurationId", "createdAt");

-- CreateIndex
CREATE INDEX "system_configurations_category_subCategory_idx" ON "system_configurations"("category", "subCategory");

-- CreateIndex
CREATE INDEX "system_configurations_scope_scopeId_idx" ON "system_configurations"("scope", "scopeId");

-- CreateIndex
CREATE INDEX "system_configurations_tags_idx" ON "system_configurations"("tags");

-- AddForeignKey
ALTER TABLE "configuration_history" ADD CONSTRAINT "configuration_history_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "system_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
