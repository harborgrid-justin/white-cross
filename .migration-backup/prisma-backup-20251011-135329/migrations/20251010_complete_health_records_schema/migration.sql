-- Complete Health Records Schema Migration
-- This migration implements a comprehensive health records system for the White Cross healthcare platform
-- HIPAA compliant with full audit trails and proper indexing

-- =====================================================
-- STEP 1: Create New Enums
-- =====================================================

-- Allergy Type Enum
CREATE TYPE "AllergyType" AS ENUM (
  'FOOD',
  'MEDICATION',
  'ENVIRONMENTAL',
  'INSECT',
  'LATEX',
  'ANIMAL',
  'CHEMICAL',
  'SEASONAL',
  'OTHER'
);

-- Condition Severity Enum
CREATE TYPE "ConditionSeverity" AS ENUM (
  'MILD',
  'MODERATE',
  'SEVERE',
  'CRITICAL'
);

-- Condition Status Enum
CREATE TYPE "ConditionStatus" AS ENUM (
  'ACTIVE',
  'MANAGED',
  'RESOLVED',
  'MONITORING',
  'INACTIVE'
);

-- Vaccine Type Enum
CREATE TYPE "VaccineType" AS ENUM (
  'COVID_19',
  'FLU',
  'MEASLES',
  'MUMPS',
  'RUBELLA',
  'MMR',
  'POLIO',
  'HEPATITIS_A',
  'HEPATITIS_B',
  'VARICELLA',
  'TETANUS',
  'DIPHTHERIA',
  'PERTUSSIS',
  'TDAP',
  'DTaP',
  'HIB',
  'PNEUMOCOCCAL',
  'ROTAVIRUS',
  'MENINGOCOCCAL',
  'HPV',
  'OTHER'
);

-- Administration Site Enum
CREATE TYPE "AdministrationSite" AS ENUM (
  'ARM_LEFT',
  'ARM_RIGHT',
  'THIGH_LEFT',
  'THIGH_RIGHT',
  'DELTOID_LEFT',
  'DELTOID_RIGHT',
  'BUTTOCK_LEFT',
  'BUTTOCK_RIGHT',
  'ORAL',
  'NASAL',
  'OTHER'
);

-- Administration Route Enum
CREATE TYPE "AdministrationRoute" AS ENUM (
  'INTRAMUSCULAR',
  'SUBCUTANEOUS',
  'INTRADERMAL',
  'ORAL',
  'INTRANASAL',
  'INTRAVENOUS',
  'OTHER'
);

-- Vaccine Compliance Status Enum
CREATE TYPE "VaccineComplianceStatus" AS ENUM (
  'COMPLIANT',
  'OVERDUE',
  'PARTIALLY_COMPLIANT',
  'EXEMPT',
  'NON_COMPLIANT'
);

-- Screening Type Enum
CREATE TYPE "ScreeningType" AS ENUM (
  'VISION',
  'HEARING',
  'SCOLIOSIS',
  'DENTAL',
  'BMI',
  'BLOOD_PRESSURE',
  'DEVELOPMENTAL',
  'SPEECH',
  'MENTAL_HEALTH',
  'TUBERCULOSIS',
  'LEAD',
  'ANEMIA',
  'OTHER'
);

-- Screening Outcome Enum
CREATE TYPE "ScreeningOutcome" AS ENUM (
  'PASS',
  'REFER',
  'FAIL',
  'INCONCLUSIVE',
  'INCOMPLETE'
);

-- Follow Up Status Enum
CREATE TYPE "FollowUpStatus" AS ENUM (
  'PENDING',
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
  'OVERDUE',
  'NOT_NEEDED'
);

-- Consciousness Level Enum
CREATE TYPE "ConsciousnessLevel" AS ENUM (
  'ALERT',
  'VERBAL',
  'PAIN',
  'UNRESPONSIVE',
  'DROWSY',
  'CONFUSED',
  'LETHARGIC'
);

-- =====================================================
-- STEP 2: Update Existing Enums
-- =====================================================

-- Update HealthRecordType enum with new values
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'EXAMINATION';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'ALLERGY_DOCUMENTATION';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'CHRONIC_CONDITION_REVIEW';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'GROWTH_ASSESSMENT';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'VITAL_SIGNS_CHECK';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'EMERGENCY_VISIT';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'FOLLOW_UP';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'CONSULTATION';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'DIAGNOSTIC_TEST';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'PROCEDURE';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'HOSPITALIZATION';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'SURGERY';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'COUNSELING';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'THERAPY';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'NUTRITION';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'MEDICATION_REVIEW';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'IMMUNIZATION';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'LAB_RESULT';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'RADIOLOGY';
ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS 'OTHER';

-- =====================================================
-- STEP 3: Alter Existing health_records Table
-- =====================================================

-- Rename 'type' to 'recordType' for consistency
ALTER TABLE "health_records" RENAME COLUMN "type" TO "recordType";

-- Rename 'date' to 'recordDate' for clarity
ALTER TABLE "health_records" RENAME COLUMN "date" TO "recordDate";

-- Add new columns to health_records
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL DEFAULT 'Health Record';
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "providerNpi" TEXT;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "facility" TEXT;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "facilityNpi" TEXT;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "diagnosis" TEXT;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "diagnosisCode" TEXT;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "treatment" TEXT;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "followUpRequired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "followUpDate" TIMESTAMP(3);
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "followUpCompleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "isConfidential" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;

-- Drop 'vital' column as we now have dedicated VitalSigns table
ALTER TABLE "health_records" DROP COLUMN IF EXISTS "vital";

-- Remove the default from title after initial migration
ALTER TABLE "health_records" ALTER COLUMN "title" DROP DEFAULT;

-- =====================================================
-- STEP 4: Alter Existing allergies Table
-- =====================================================

-- Add new columns to allergies
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "allergyType" "AllergyType" NOT NULL DEFAULT 'OTHER';
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "symptoms" TEXT;
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "reactions" JSONB;
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "emergencyProtocol" TEXT;
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "onsetDate" TIMESTAMP(3);
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "diagnosedDate" TIMESTAMP(3);
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "diagnosedBy" TEXT;
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "verificationDate" TIMESTAMP(3);
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "epiPenRequired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "epiPenLocation" TEXT;
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "epiPenExpiration" TIMESTAMP(3);
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "healthRecordId" TEXT;
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;

-- Rename reaction to treatment (was backward)
-- Note: If there's existing data, you may want to migrate it first
-- ALTER TABLE "allergies" RENAME COLUMN "reaction" TO "oldReaction";

-- Remove the default from allergyType after initial migration
ALTER TABLE "allergies" ALTER COLUMN "allergyType" DROP DEFAULT;

-- =====================================================
-- STEP 5: Alter Existing chronic_conditions Table
-- =====================================================

-- Add new columns to chronic_conditions
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "icdCode" TEXT;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "diagnosedBy" TEXT;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "severity" "ConditionSeverity" NOT NULL DEFAULT 'MODERATE';
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "medications" JSONB;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "treatments" TEXT;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "accommodationsRequired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "accommodationDetails" TEXT;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "emergencyProtocol" TEXT;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "actionPlan" TEXT;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "reviewFrequency" TEXT;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "restrictions" JSONB;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "precautions" JSONB;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "healthRecordId" TEXT;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;

-- Update status column to use new enum
-- First drop the default, then convert the type, then set new default
ALTER TABLE "chronic_conditions" ALTER COLUMN "status" DROP DEFAULT;

-- Convert existing string status to enum
ALTER TABLE "chronic_conditions" ALTER COLUMN "status" TYPE "ConditionStatus" USING (
  CASE
    WHEN "status" = 'ACTIVE' THEN 'ACTIVE'::"ConditionStatus"
    WHEN "status" = 'MANAGED' THEN 'MANAGED'::"ConditionStatus"
    WHEN "status" = 'RESOLVED' THEN 'RESOLVED'::"ConditionStatus"
    WHEN "status" = 'MONITORING' THEN 'MONITORING'::"ConditionStatus"
    ELSE 'ACTIVE'::"ConditionStatus"
  END
);

-- Set the new default after type conversion
ALTER TABLE "chronic_conditions" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'::"ConditionStatus";

-- Convert severity from string to enum if needed
-- ALTER TABLE "chronic_conditions" ALTER COLUMN "severity" TYPE "ConditionSeverity" USING ...

-- Remove the default from severity after initial migration
ALTER TABLE "chronic_conditions" ALTER COLUMN "severity" DROP DEFAULT;

-- =====================================================
-- STEP 6: Create vaccinations Table
-- =====================================================

CREATE TABLE IF NOT EXISTS "vaccinations" (
  "id" TEXT NOT NULL,
  "vaccineName" TEXT NOT NULL,
  "vaccineType" "VaccineType",
  "manufacturer" TEXT,
  "lotNumber" TEXT,
  "cvxCode" TEXT,
  "ndcCode" TEXT,
  "doseNumber" INTEGER,
  "totalDoses" INTEGER,
  "seriesComplete" BOOLEAN NOT NULL DEFAULT false,
  "administrationDate" TIMESTAMP(3) NOT NULL,
  "administeredBy" TEXT NOT NULL,
  "administeredByRole" TEXT,
  "facility" TEXT,
  "siteOfAdministration" "AdministrationSite",
  "routeOfAdministration" "AdministrationRoute",
  "dosageAmount" TEXT,
  "expirationDate" TIMESTAMP(3),
  "nextDueDate" TIMESTAMP(3),
  "reactions" TEXT,
  "adverseEvents" JSONB,
  "exemptionStatus" BOOLEAN NOT NULL DEFAULT false,
  "exemptionReason" TEXT,
  "exemptionDocument" TEXT,
  "complianceStatus" "VaccineComplianceStatus" NOT NULL DEFAULT 'COMPLIANT',
  "vfcEligibility" BOOLEAN NOT NULL DEFAULT false,
  "visProvided" BOOLEAN NOT NULL DEFAULT false,
  "visDate" TIMESTAMP(3),
  "consentObtained" BOOLEAN NOT NULL DEFAULT false,
  "consentBy" TEXT,
  "notes" TEXT,
  "studentId" TEXT NOT NULL,
  "healthRecordId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT,
  "updatedBy" TEXT,

  CONSTRAINT "vaccinations_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- STEP 7: Create screenings Table
-- =====================================================

CREATE TABLE IF NOT EXISTS "screenings" (
  "id" TEXT NOT NULL,
  "screeningType" "ScreeningType" NOT NULL,
  "screeningDate" TIMESTAMP(3) NOT NULL,
  "screenedBy" TEXT NOT NULL,
  "screenedByRole" TEXT,
  "results" JSONB,
  "outcome" "ScreeningOutcome" NOT NULL DEFAULT 'PASS',
  "referralRequired" BOOLEAN NOT NULL DEFAULT false,
  "referralTo" TEXT,
  "referralDate" TIMESTAMP(3),
  "referralReason" TEXT,
  "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
  "followUpDate" TIMESTAMP(3),
  "followUpStatus" "FollowUpStatus",
  "equipmentUsed" TEXT,
  "testDetails" JSONB,
  "rightEye" TEXT,
  "leftEye" TEXT,
  "rightEar" TEXT,
  "leftEar" TEXT,
  "passedCriteria" BOOLEAN,
  "notes" TEXT,
  "studentId" TEXT NOT NULL,
  "healthRecordId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT,
  "updatedBy" TEXT,

  CONSTRAINT "screenings_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- STEP 8: Create growth_measurements Table
-- =====================================================

CREATE TABLE IF NOT EXISTS "growth_measurements" (
  "id" TEXT NOT NULL,
  "measurementDate" TIMESTAMP(3) NOT NULL,
  "measuredBy" TEXT NOT NULL,
  "measuredByRole" TEXT,
  "height" DECIMAL(65,30),
  "heightUnit" TEXT NOT NULL DEFAULT 'cm',
  "weight" DECIMAL(65,30),
  "weightUnit" TEXT NOT NULL DEFAULT 'kg',
  "bmi" DECIMAL(65,30),
  "bmiPercentile" DECIMAL(65,30),
  "headCircumference" DECIMAL(65,30),
  "heightPercentile" DECIMAL(65,30),
  "weightPercentile" DECIMAL(65,30),
  "growthPercentiles" JSONB,
  "nutritionalStatus" TEXT,
  "concerns" TEXT,
  "notes" TEXT,
  "studentId" TEXT NOT NULL,
  "healthRecordId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT,
  "updatedBy" TEXT,

  CONSTRAINT "growth_measurements_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- STEP 9: Create vital_signs Table
-- =====================================================

CREATE TABLE IF NOT EXISTS "vital_signs" (
  "id" TEXT NOT NULL,
  "measurementDate" TIMESTAMP(3) NOT NULL,
  "measuredBy" TEXT NOT NULL,
  "measuredByRole" TEXT,
  "temperature" DECIMAL(65,30),
  "temperatureUnit" TEXT NOT NULL DEFAULT 'F',
  "temperatureSite" TEXT,
  "bloodPressureSystolic" INTEGER,
  "bloodPressureDiastolic" INTEGER,
  "bloodPressurePosition" TEXT,
  "heartRate" INTEGER,
  "heartRhythm" TEXT,
  "respiratoryRate" INTEGER,
  "oxygenSaturation" INTEGER,
  "oxygenSupplemental" BOOLEAN NOT NULL DEFAULT false,
  "painLevel" INTEGER,
  "painLocation" TEXT,
  "consciousness" "ConsciousnessLevel",
  "glucoseLevel" DECIMAL(65,30),
  "peakFlow" INTEGER,
  "notes" TEXT,
  "studentId" TEXT NOT NULL,
  "healthRecordId" TEXT,
  "appointmentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT,
  "updatedBy" TEXT,

  CONSTRAINT "vital_signs_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- STEP 10: Add Foreign Key Constraints
-- =====================================================

-- allergies foreign keys
ALTER TABLE "allergies" ADD CONSTRAINT "allergies_healthRecordId_fkey"
  FOREIGN KEY ("healthRecordId") REFERENCES "health_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- chronic_conditions foreign keys
ALTER TABLE "chronic_conditions" ADD CONSTRAINT "chronic_conditions_healthRecordId_fkey"
  FOREIGN KEY ("healthRecordId") REFERENCES "health_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- vaccinations foreign keys
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_healthRecordId_fkey"
  FOREIGN KEY ("healthRecordId") REFERENCES "health_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- screenings foreign keys
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "screenings" ADD CONSTRAINT "screenings_healthRecordId_fkey"
  FOREIGN KEY ("healthRecordId") REFERENCES "health_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- growth_measurements foreign keys
ALTER TABLE "growth_measurements" ADD CONSTRAINT "growth_measurements_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "growth_measurements" ADD CONSTRAINT "growth_measurements_healthRecordId_fkey"
  FOREIGN KEY ("healthRecordId") REFERENCES "health_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- vital_signs foreign keys
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_healthRecordId_fkey"
  FOREIGN KEY ("healthRecordId") REFERENCES "health_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_appointmentId_fkey"
  FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- =====================================================
-- STEP 11: Create Indexes for Performance Optimization
-- =====================================================

-- health_records indexes
CREATE INDEX IF NOT EXISTS "health_records_studentId_recordDate_idx" ON "health_records"("studentId", "recordDate");
CREATE INDEX IF NOT EXISTS "health_records_recordType_recordDate_idx" ON "health_records"("recordType", "recordDate");
CREATE INDEX IF NOT EXISTS "health_records_createdBy_idx" ON "health_records"("createdBy");
CREATE INDEX IF NOT EXISTS "health_records_followUpRequired_followUpDate_idx" ON "health_records"("followUpRequired", "followUpDate");

-- allergies indexes
CREATE INDEX IF NOT EXISTS "allergies_studentId_active_idx" ON "allergies"("studentId", "active");
CREATE INDEX IF NOT EXISTS "allergies_allergyType_severity_idx" ON "allergies"("allergyType", "severity");
CREATE INDEX IF NOT EXISTS "allergies_epiPenExpiration_idx" ON "allergies"("epiPenExpiration");

-- chronic_conditions indexes
CREATE INDEX IF NOT EXISTS "chronic_conditions_studentId_status_idx" ON "chronic_conditions"("studentId", "status");
CREATE INDEX IF NOT EXISTS "chronic_conditions_severity_status_idx" ON "chronic_conditions"("severity", "status");
CREATE INDEX IF NOT EXISTS "chronic_conditions_nextReviewDate_idx" ON "chronic_conditions"("nextReviewDate");

-- vaccinations indexes
CREATE INDEX IF NOT EXISTS "vaccinations_studentId_administrationDate_idx" ON "vaccinations"("studentId", "administrationDate");
CREATE INDEX IF NOT EXISTS "vaccinations_vaccineType_complianceStatus_idx" ON "vaccinations"("vaccineType", "complianceStatus");
CREATE INDEX IF NOT EXISTS "vaccinations_nextDueDate_idx" ON "vaccinations"("nextDueDate");
CREATE INDEX IF NOT EXISTS "vaccinations_expirationDate_idx" ON "vaccinations"("expirationDate");

-- screenings indexes
CREATE INDEX IF NOT EXISTS "screenings_studentId_screeningDate_idx" ON "screenings"("studentId", "screeningDate");
CREATE INDEX IF NOT EXISTS "screenings_screeningType_outcome_idx" ON "screenings"("screeningType", "outcome");
CREATE INDEX IF NOT EXISTS "screenings_referralRequired_followUpRequired_idx" ON "screenings"("referralRequired", "followUpRequired");
CREATE INDEX IF NOT EXISTS "screenings_followUpDate_idx" ON "screenings"("followUpDate");

-- growth_measurements indexes
CREATE INDEX IF NOT EXISTS "growth_measurements_studentId_measurementDate_idx" ON "growth_measurements"("studentId", "measurementDate");
CREATE INDEX IF NOT EXISTS "growth_measurements_measurementDate_idx" ON "growth_measurements"("measurementDate");

-- vital_signs indexes
CREATE INDEX IF NOT EXISTS "vital_signs_studentId_measurementDate_idx" ON "vital_signs"("studentId", "measurementDate");
CREATE INDEX IF NOT EXISTS "vital_signs_measurementDate_idx" ON "vital_signs"("measurementDate");
CREATE INDEX IF NOT EXISTS "vital_signs_appointmentId_idx" ON "vital_signs"("appointmentId");

-- =====================================================
-- STEP 12: Add Comments for Documentation
-- =====================================================

COMMENT ON TABLE "health_records" IS 'Main health records table storing comprehensive student health information. HIPAA compliant with audit trails.';
COMMENT ON TABLE "allergies" IS 'Student allergy records with detailed tracking including EpiPen management and emergency protocols.';
COMMENT ON TABLE "chronic_conditions" IS 'Chronic health conditions with care plans, accommodations, and emergency protocols.';
COMMENT ON TABLE "vaccinations" IS 'Comprehensive vaccination records tracking compliance, exemptions, and adverse events.';
COMMENT ON TABLE "screenings" IS 'Health screening records for vision, hearing, scoliosis, and other assessments.';
COMMENT ON TABLE "growth_measurements" IS 'Growth tracking including height, weight, BMI, and percentiles.';
COMMENT ON TABLE "vital_signs" IS 'Vital signs measurements taken during appointments or health assessments.';

-- Column comments for key fields
COMMENT ON COLUMN "health_records"."providerNpi" IS 'National Provider Identifier for healthcare provider';
COMMENT ON COLUMN "health_records"."diagnosisCode" IS 'ICD-10 diagnosis code';
COMMENT ON COLUMN "health_records"."isConfidential" IS 'Marks record as requiring additional access controls';
COMMENT ON COLUMN "vaccinations"."cvxCode" IS 'CDC vaccine code for standardized vaccine identification';
COMMENT ON COLUMN "vaccinations"."ndcCode" IS 'National Drug Code for specific vaccine product';
COMMENT ON COLUMN "vaccinations"."vfcEligibility" IS 'Vaccines for Children program eligibility';
COMMENT ON COLUMN "vaccinations"."visProvided" IS 'Vaccine Information Statement provided to patient/guardian';

-- =====================================================
-- Migration Complete
-- =====================================================
