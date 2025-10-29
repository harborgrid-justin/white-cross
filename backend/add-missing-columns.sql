-- Add missing columns to security_incidents table
ALTER TABLE security_incidents
ADD COLUMN IF NOT EXISTS "detectedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS "title" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "description" TEXT;

-- Add missing column to ip_restrictions table
ALTER TABLE ip_restrictions
ADD COLUMN IF NOT EXISTS "ipRange" JSONB;

-- Rename column in health_records table if needed (from record_date to recordDate)
-- Note: This might already be correct, just adding for completeness
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name='health_records' AND column_name='record_date') THEN
        ALTER TABLE health_records RENAME COLUMN record_date TO "recordDate";
    END IF;
END $$;
