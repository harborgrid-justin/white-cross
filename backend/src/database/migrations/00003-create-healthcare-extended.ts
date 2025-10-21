/**
 * LOC: D0CF0248C8
 * WC-GEN-018 | 00003-create-healthcare-extended.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-018 | 00003-create-healthcare-extended.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Create health_records table
  await queryInterface.createTable('health_records', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    recordType: {
      type: DataTypes.ENUM(
        'CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM',
        'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING', 'EXAMINATION',
        'ALLERGY_DOCUMENTATION', 'CHRONIC_CONDITION_REVIEW', 'GROWTH_ASSESSMENT',
        'VITAL_SIGNS_CHECK', 'EMERGENCY_VISIT', 'FOLLOW_UP', 'CONSULTATION',
        'DIAGNOSTIC_TEST', 'PROCEDURE', 'HOSPITALIZATION', 'SURGERY', 'COUNSELING',
        'THERAPY', 'NUTRITION', 'MEDICATION_REVIEW', 'IMMUNIZATION', 'LAB_RESULT',
        'RADIOLOGY', 'OTHER'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recordDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    providerNpi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facility: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facilityNpi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    diagnosisCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    followUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    followUpCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isConfidential: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create allergies table
  await queryInterface.createTable('allergies', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    healthRecordId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'health_records',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    allergen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allergyType: {
      type: DataTypes.ENUM('FOOD', 'MEDICATION', 'ENVIRONMENTAL', 'INSECT', 'LATEX', 'ANIMAL', 'CHEMICAL', 'SEASONAL', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    severity: {
      type: DataTypes.ENUM('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'),
      allowNull: false,
    },
    symptoms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reactions: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyProtocol: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    onsetDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    diagnosedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    diagnosedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    epiPenRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    epiPenLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    epiPenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create chronic_conditions table
  await queryInterface.createTable('chronic_conditions', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    healthRecordId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'health_records',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icdCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    diagnosisDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    diagnosedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    severity: {
      type: DataTypes.ENUM('MILD', 'MODERATE', 'SEVERE', 'CRITICAL'),
      allowNull: false,
      defaultValue: 'MODERATE',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'MANAGED', 'RESOLVED', 'MONITORING', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    medications: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    treatments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    accommodationsRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    accommodationDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyProtocol: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    actionPlan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nextReviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewFrequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    restrictions: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    precautions: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    triggers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    carePlan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastReviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create vaccinations table
  await queryInterface.createTable('vaccinations', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    healthRecordId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'health_records',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    vaccineName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vaccineType: {
      type: DataTypes.ENUM(
        'COVID_19', 'FLU', 'MEASLES', 'MUMPS', 'RUBELLA', 'MMR', 'POLIO',
        'HEPATITIS_A', 'HEPATITIS_B', 'VARICELLA', 'TETANUS', 'DIPHTHERIA',
        'PERTUSSIS', 'TDAP', 'DTaP', 'HIB', 'PNEUMOCOCCAL', 'ROTAVIRUS',
        'MENINGOCOCCAL', 'HPV', 'OTHER'
      ),
      allowNull: true,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lotNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cvxCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ndcCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    doseNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalDoses: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    seriesComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    administrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    administeredBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    administeredByRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facility: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    siteOfAdministration: {
      type: DataTypes.ENUM(
        'ARM_LEFT', 'ARM_RIGHT', 'THIGH_LEFT', 'THIGH_RIGHT', 'DELTOID_LEFT',
        'DELTOID_RIGHT', 'BUTTOCK_LEFT', 'BUTTOCK_RIGHT', 'ORAL', 'NASAL', 'OTHER'
      ),
      allowNull: true,
    },
    routeOfAdministration: {
      type: DataTypes.ENUM('INTRAMUSCULAR', 'SUBCUTANEOUS', 'INTRADERMAL', 'ORAL', 'INTRANASAL', 'INTRAVENOUS', 'OTHER'),
      allowNull: true,
    },
    dosageAmount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextDueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reactions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    adverseEvents: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    exemptionStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    exemptionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    exemptionDocument: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complianceStatus: {
      type: DataTypes.ENUM('COMPLIANT', 'OVERDUE', 'PARTIALLY_COMPLIANT', 'EXEMPT', 'NON_COMPLIANT'),
      allowNull: false,
      defaultValue: 'COMPLIANT',
    },
    vfcEligibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    visProvided: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    visDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    consentObtained: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    consentBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create screenings table
  await queryInterface.createTable('screenings', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    healthRecordId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'health_records',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    screeningType: {
      type: DataTypes.ENUM(
        'VISION', 'HEARING', 'SCOLIOSIS', 'DENTAL', 'BMI', 'BLOOD_PRESSURE',
        'DEVELOPMENTAL', 'SPEECH', 'MENTAL_HEALTH', 'TUBERCULOSIS', 'LEAD',
        'ANEMIA', 'OTHER'
      ),
      allowNull: false,
    },
    screeningDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    screenedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    screenedByRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    results: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    outcome: {
      type: DataTypes.ENUM('PASS', 'REFER', 'FAIL', 'INCONCLUSIVE', 'INCOMPLETE'),
      allowNull: false,
      defaultValue: 'PASS',
    },
    referralRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    referralTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referralDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    referralReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    followUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    followUpStatus: {
      type: DataTypes.ENUM('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'OVERDUE', 'NOT_NEEDED'),
      allowNull: true,
    },
    equipmentUsed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    testDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    rightEye: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leftEye: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rightEar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leftEar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passedCriteria: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create growth_measurements table
  await queryInterface.createTable('growth_measurements', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    healthRecordId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'health_records',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    measurementDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    measuredBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measuredByRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    heightUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'cm',
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    weightUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'kg',
    },
    bmi: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    bmiPercentile: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    headCircumference: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    heightPercentile: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    weightPercentile: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    growthPercentiles: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    nutritionalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    concerns: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create vital_signs table
  await queryInterface.createTable('vital_signs', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    healthRecordId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'health_records',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    appointmentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    measurementDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    measuredBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measuredByRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    temperature: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    temperatureUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'F',
    },
    temperatureSite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodPressureSystolic: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bloodPressureDiastolic: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bloodPressurePosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    heartRhythm: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    respiratoryRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oxygenSaturation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oxygenSupplemental: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    painLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    painLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    consciousness: {
      type: DataTypes.ENUM('ALERT', 'VERBAL', 'PAIN', 'UNRESPONSIVE', 'DROWSY', 'CONFUSED', 'LETHARGIC'),
      allowNull: true,
    },
    glucoseLevel: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    peakFlow: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create appointments table
  await queryInterface.createTable('appointments', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    type: {
      type: DataTypes.ENUM('ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY'),
      allowNull: false,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'),
      allowNull: false,
      defaultValue: 'SCHEDULED',
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create nurse_availability table
  await queryInterface.createTable('nurse_availability', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    specificDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create appointment_waitlist table
  await queryInterface.createTable('appointment_waitlist', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    type: {
      type: DataTypes.ENUM('ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY'),
      allowNull: false,
    },
    preferredDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT'),
      allowNull: false,
      defaultValue: 'NORMAL',
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('WAITING', 'NOTIFIED', 'SCHEDULED', 'EXPIRED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'WAITING',
    },
    notifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create appointment_reminders table
  await queryInterface.createTable('appointment_reminders', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    appointmentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'appointments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'),
      allowNull: false,
    },
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'SENT', 'FAILED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'SCHEDULED',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failureReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Add indexes for health_records
  await queryInterface.addIndex('health_records', ['studentId', 'recordDate']);
  await queryInterface.addIndex('health_records', ['recordType', 'recordDate']);
  await queryInterface.addIndex('health_records', ['createdBy']);
  await queryInterface.addIndex('health_records', ['followUpRequired', 'followUpDate']);

  // Add indexes for allergies
  await queryInterface.addIndex('allergies', ['studentId', 'active']);
  await queryInterface.addIndex('allergies', ['allergyType', 'severity']);
  await queryInterface.addIndex('allergies', ['epiPenExpiration']);

  // Add indexes for chronic_conditions
  await queryInterface.addIndex('chronic_conditions', ['studentId', 'status']);
  await queryInterface.addIndex('chronic_conditions', ['severity', 'status']);
  await queryInterface.addIndex('chronic_conditions', ['nextReviewDate']);

  // Add indexes for vaccinations
  await queryInterface.addIndex('vaccinations', ['studentId', 'administrationDate']);
  await queryInterface.addIndex('vaccinations', ['vaccineType', 'complianceStatus']);
  await queryInterface.addIndex('vaccinations', ['nextDueDate']);
  await queryInterface.addIndex('vaccinations', ['expirationDate']);

  // Add indexes for screenings
  await queryInterface.addIndex('screenings', ['studentId', 'screeningDate']);
  await queryInterface.addIndex('screenings', ['screeningType', 'outcome']);
  await queryInterface.addIndex('screenings', ['referralRequired', 'followUpRequired']);
  await queryInterface.addIndex('screenings', ['followUpDate']);

  // Add indexes for growth_measurements
  await queryInterface.addIndex('growth_measurements', ['studentId', 'measurementDate']);
  await queryInterface.addIndex('growth_measurements', ['measurementDate']);

  // Add indexes for vital_signs
  await queryInterface.addIndex('vital_signs', ['studentId', 'measurementDate']);
  await queryInterface.addIndex('vital_signs', ['measurementDate']);
  await queryInterface.addIndex('vital_signs', ['appointmentId']);

  // Add indexes for appointments
  await queryInterface.addIndex('appointments', ['studentId']);
  await queryInterface.addIndex('appointments', ['nurseId']);
  await queryInterface.addIndex('appointments', ['scheduledAt']);
  await queryInterface.addIndex('appointments', ['status']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('appointment_reminders');
  await queryInterface.dropTable('appointment_waitlist');
  await queryInterface.dropTable('nurse_availability');
  await queryInterface.dropTable('appointments');
  await queryInterface.dropTable('vital_signs');
  await queryInterface.dropTable('growth_measurements');
  await queryInterface.dropTable('screenings');
  await queryInterface.dropTable('vaccinations');
  await queryInterface.dropTable('chronic_conditions');
  await queryInterface.dropTable('allergies');
  await queryInterface.dropTable('health_records');
}
