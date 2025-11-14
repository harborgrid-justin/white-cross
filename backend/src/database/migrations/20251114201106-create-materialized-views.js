'use strict';

/**
 * Materialized Views Migration
 * 
 * Creates essential materialized views for the health management system
 * after database rebuild from Sequelize models.
 * 
 * This migration creates the three critical materialized views that were
 * causing server errors:
 * - mv_medication_schedule: Active medication administration schedule
 * - mv_student_health_summary: Comprehensive student health dashboard  
 * - mv_allergy_summary: Allergy alerts and EpiPen locations
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Creating materialized views for dashboard optimization...');

      // =====================================================
      // 1. STUDENT HEALTH SUMMARY VIEW
      // =====================================================

      console.log('Creating student health summary materialized view...');
      await queryInterface.sequelize.query(`
        CREATE MATERIALIZED VIEW "mv_student_health_summary" AS
        SELECT
          s."id" AS "studentId",
          s."studentNumber",
          s."firstName",
          s."lastName",
          s."grade",
          s."schoolId",
          s."nurseId",
          s."dateOfBirth",
          s."isActive",

          -- Health records summary (no isActive column, use deletedAt instead)
          COUNT(DISTINCT hr."id") AS "totalHealthRecordsCount",
          MAX(hr."recordDate") AS "lastHealthRecordDate",
          MAX(hr."recordDate") FILTER (WHERE hr."recordType" = 'PHYSICAL_EXAM') AS "lastPhysicalExamDate",
          MAX(hr."recordDate") FILTER (WHERE hr."recordType" = 'VISION') AS "lastVisionScreeningDate",
          MAX(hr."recordDate") FILTER (WHERE hr."recordType" = 'HEARING') AS "lastHearingScreeningDate",

          -- Allergies summary
          COUNT(DISTINCT a."id") FILTER (WHERE a."active" = true) AS "activeAllergiesCount",
          COUNT(DISTINCT a."id") FILTER (WHERE a."active" = true AND a."severity" = 'SEVERE') AS "severeAllergiesCount",
          bool_or(a."epiPenRequired") AS "hasEpiPenRequired",
          MAX(a."epiPenLocation") FILTER (WHERE a."epiPenRequired" = true) AS "epiPenLocation",

          -- Medications summary
          COUNT(DISTINCT sm."id") FILTER (
            WHERE sm."isActive" = true
              AND sm."startDate" <= CURRENT_DATE
              AND (sm."endDate" IS NULL OR sm."endDate" >= CURRENT_DATE)
          ) AS "activeMedicationsCount",
          COUNT(DISTINCT sm."id") FILTER (
            WHERE sm."isActive" = true
              AND sm."startDate" <= CURRENT_DATE
              AND (sm."endDate" IS NULL OR sm."endDate" >= CURRENT_DATE)
              AND EXISTS (
                SELECT 1 FROM "medications" m2 
                WHERE m2."id" = sm."medicationId" 
                  AND m2."requiresWitness" = true 
                  AND m2."deletedAt" IS NULL
              )
          ) AS "controlledMedicationsCount",

          -- Chronic conditions summary
          COUNT(DISTINCT cc."id") FILTER (WHERE cc."isActive" = true) AS "chronicConditionsCount",

          -- Vaccinations summary
          COUNT(DISTINCT v."id") AS "vaccinationsCount",
          COUNT(DISTINCT v."id") FILTER (WHERE v."complianceStatus" = 'COMPLIANT') AS "compliantVaccinationsCount",
          COUNT(DISTINCT v."id") FILTER (WHERE v."complianceStatus" = 'NON_COMPLIANT') AS "nonCompliantVaccinationsCount",

          -- Last updated
          GREATEST(
            MAX(hr."updatedAt"),
            MAX(a."updatedAt"),
            MAX(sm."updatedAt"),
            MAX(cc."updatedAt"),
            MAX(v."updatedAt"),
            s."updatedAt"
          ) AS "lastDataUpdate"

        FROM "students" s
        LEFT JOIN "health_records" hr ON s."id" = hr."studentId" AND hr."deletedAt" IS NULL
        LEFT JOIN "allergies" a ON s."id" = a."studentId" AND a."deletedAt" IS NULL
        LEFT JOIN "student_medications" sm ON s."id" = sm."studentId"
        LEFT JOIN "chronic_conditions" cc ON s."id" = cc."studentId" AND cc."deletedAt" IS NULL
        LEFT JOIN "vaccinations" v ON s."id" = v."studentId" AND v."deletedAt" IS NULL
        WHERE s."deletedAt" IS NULL
        GROUP BY s."id", s."studentNumber", s."firstName", s."lastName", s."grade",
                 s."schoolId", s."nurseId", s."dateOfBirth", s."isActive", s."updatedAt";
      `, { transaction });

      console.log('Creating indexes on student health summary view...');
      await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX "mv_student_health_summary_pkey"
        ON "mv_student_health_summary" ("studentId");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX "mv_student_health_summary_school_grade"
        ON "mv_student_health_summary" ("schoolId", "grade", "isActive");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX "mv_student_health_summary_nurse"
        ON "mv_student_health_summary" ("nurseId", "isActive");
      `, { transaction });

      // =====================================================
      // 2. MEDICATION ADMINISTRATION SCHEDULE VIEW
      // =====================================================

      console.log('Creating medication schedule materialized view...');
      await queryInterface.sequelize.query(`
        CREATE MATERIALIZED VIEW "mv_medication_schedule" AS
        SELECT
          sm."id" AS "studentMedicationId",
          s."id" AS "studentId",
          s."studentNumber",
          s."firstName" || ' ' || s."lastName" AS "studentName",
          s."grade",
          s."schoolId",
          s."nurseId",
          m."id" AS "medicationId",
          m."name" AS "medicationName",
          m."genericName" AS "medicationGenericName",
          sm."dosage",
          sm."route",
          sm."frequency",
          sm."instructions",
          sm."startDate",
          sm."endDate",
          m."requiresWitness",
          m."isControlled",
          m."deaSchedule",

          -- Next scheduled time placeholder (no scheduledTimes column in model)
          NULL AS "nextScheduledTime",

          -- Last administration
          (
            SELECT MAX(ml."administeredAt")
            FROM "medication_logs" ml
            WHERE ml."studentId" = sm."studentId"
              AND ml."medicationId" = sm."medicationId"
              AND ml."status" = 'ADMINISTERED'
          ) AS "lastAdministeredAt",

          -- Administration count today
          (
            SELECT COUNT(*)
            FROM "medication_logs" ml
            WHERE ml."studentId" = sm."studentId"
              AND ml."medicationId" = sm."medicationId"
              AND ml."status" = 'ADMINISTERED'
              AND ml."administeredAt"::date = CURRENT_DATE
          ) AS "administeredCountToday",

          -- Is due now placeholder (no scheduledTimes column available)
          false AS "isDueNow"

        FROM "student_medications" sm
        JOIN "students" s ON sm."studentId" = s."id"
        JOIN "medications" m ON sm."medicationId" = m."id" AND m."deletedAt" IS NULL
        WHERE sm."isActive" = true
          AND sm."startDate" <= CURRENT_DATE
          AND (sm."endDate" IS NULL OR sm."endDate" >= CURRENT_DATE)
          AND s."isActive" = true
          AND s."deletedAt" IS NULL
          AND m."isActive" = true;
      `, { transaction });

      console.log('Creating indexes on medication schedule view...');
      await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX "mv_medication_schedule_pkey"
        ON "mv_medication_schedule" ("studentMedicationId");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX "mv_medication_schedule_student"
        ON "mv_medication_schedule" ("studentId");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX "mv_medication_schedule_school"
        ON "mv_medication_schedule" ("schoolId", "nurseId");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX "mv_medication_schedule_nurse"
        ON "mv_medication_schedule" ("nurseId");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX "mv_medication_schedule_due_now"
        ON "mv_medication_schedule" ("schoolId", "nurseId")
        WHERE "isDueNow" = true;
      `, { transaction });

      // =====================================================
      // 3. ALLERGY SUMMARY VIEW
      // =====================================================

      console.log('Creating allergy summary materialized view...');
      await queryInterface.sequelize.query(`
        CREATE MATERIALIZED VIEW "mv_allergy_summary" AS
        SELECT
          s."id" AS "studentId",
          s."studentNumber",
          s."firstName",
          s."lastName",
          s."grade",
          s."schoolId",
          s."nurseId",

          -- Allergy details
          array_agg(
            jsonb_build_object(
              'id', a."id",
              'allergen', a."allergen",
              'allergyType', a."allergyType",
              'severity', a."severity",
              'reaction', a."reactions",
              'epiPenRequired', a."epiPenRequired",
              'epiPenLocation', a."epiPenLocation"
            )
            ORDER BY a."severity" DESC, a."allergen"
          ) FILTER (WHERE a."id" IS NOT NULL) AS "allergies",

          -- Counts
          COUNT(DISTINCT a."id") AS "totalAllergies",
          COUNT(DISTINCT a."id") FILTER (WHERE a."severity" = 'SEVERE') AS "severeAllergies",
          COUNT(DISTINCT a."id") FILTER (WHERE a."severity" = 'MODERATE') AS "moderateAllergies",

          -- EpiPen information
          bool_or(a."epiPenRequired") AS "requiresEpiPen",
          string_agg(DISTINCT a."epiPenLocation", ', ') FILTER (WHERE a."epiPenRequired" = true) AS "epiPenLocations",

          -- Alert flag
          CASE
            WHEN COUNT(*) FILTER (WHERE a."severity" = 'SEVERE') > 0 THEN 'CRITICAL'
            WHEN COUNT(*) FILTER (WHERE a."severity" = 'MODERATE') > 0 THEN 'WARNING'
            WHEN COUNT(*) > 0 THEN 'INFO'
            ELSE 'NONE'
          END AS "alertLevel"

        FROM "students" s
        LEFT JOIN "allergies" a ON s."id" = a."studentId"
          AND a."active" = true
          AND a."deletedAt" IS NULL
        WHERE s."isActive" = true AND s."deletedAt" IS NULL
        GROUP BY s."id", s."studentNumber", s."firstName", s."lastName", s."grade",
                 s."schoolId", s."nurseId";
      `, { transaction });

      console.log('Creating indexes on allergy summary view...');
      await queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX "mv_allergy_summary_pkey"
        ON "mv_allergy_summary" ("studentId");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX "mv_allergy_summary_school"
        ON "mv_allergy_summary" ("schoolId", "alertLevel");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX "mv_allergy_summary_epipen"
        ON "mv_allergy_summary" ("schoolId")
        WHERE "requiresEpiPen" = true;
      `, { transaction });

      await transaction.commit();
      console.log('✅ Materialized views created successfully!');
      console.log('Dashboard queries will now use pre-computed views for instant results.');
      console.log('');
      console.log('Created views:');
      console.log('- mv_student_health_summary: Comprehensive student health dashboard');
      console.log('- mv_medication_schedule: Active medication administration schedule');
      console.log('- mv_allergy_summary: Allergy alerts and EpiPen locations');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error creating materialized views:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Dropping materialized views...');

      const views = [
        'mv_allergy_summary',
        'mv_medication_schedule',
        'mv_student_health_summary',
      ];

      for (const view of views) {
        console.log(`Dropping materialized view ${view}...`);
        await queryInterface.sequelize.query(`
          DROP MATERIALIZED VIEW IF EXISTS "${view}" CASCADE;
        `, { transaction });
      }

      await transaction.commit();
      console.log('✅ Materialized views dropped successfully!');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error dropping materialized views:', error);
      throw error;
    }
  }
};
