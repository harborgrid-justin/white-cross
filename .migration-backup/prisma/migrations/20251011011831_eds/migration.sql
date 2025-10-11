/*
  Warnings:

  - You are about to drop the column `reaction` on the `allergies` table. All the data in the column will be lost.
  - You are about to drop the column `verifiedAt` on the `allergies` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosedDate` on the `chronic_conditions` table. All the data in the column will be lost.
  - The `severity` column on the `chronic_conditions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `medications` column on the `chronic_conditions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `restrictions` column on the `chronic_conditions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `diagnosisDate` to the `chronic_conditions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."idx_allergies_allergen";

-- DropIndex
DROP INDEX "public"."idx_allergies_student_severity";

-- DropIndex
DROP INDEX "public"."idx_health_records_date_type";

-- DropIndex
DROP INDEX "public"."idx_health_records_student_date";

-- DropIndex
DROP INDEX "public"."idx_health_records_student_type";

-- AlterTable
ALTER TABLE "allergies" DROP COLUMN "reaction",
DROP COLUMN "verifiedAt",
ALTER COLUMN "allergyType" SET DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "chronic_conditions" DROP COLUMN "diagnosedDate",
ADD COLUMN     "diagnosisDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "severity",
ADD COLUMN     "severity" "ConditionSeverity" NOT NULL DEFAULT 'MODERATE',
DROP COLUMN "medications",
ADD COLUMN     "medications" JSONB,
DROP COLUMN "restrictions",
ADD COLUMN     "restrictions" JSONB;

-- CreateIndex
CREATE INDEX "chronic_conditions_severity_status_idx" ON "chronic_conditions"("severity", "status");
