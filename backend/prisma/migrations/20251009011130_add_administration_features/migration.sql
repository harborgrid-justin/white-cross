-- AlterTable
ALTER TABLE "districts" ADD COLUMN     "description" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active',
ADD COLUMN     "superintendent" TEXT;

-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "principalName" TEXT,
ADD COLUMN     "schoolType" TEXT DEFAULT 'Elementary',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active',
ADD COLUMN     "totalEnrollment" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "schoolId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
