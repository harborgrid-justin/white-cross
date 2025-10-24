/**
 * Health Assessments Response Schemas - Comprehensive Swagger/OpenAPI Documentation
 *
 * This file contains all response schemas for health assessment endpoints (11 routes):
 * - Health risk assessment (2 routes)
 * - Health screenings (2 routes)
 * - Growth tracking (2 routes)
 * - Immunization forecast (1 route)
 * - Emergency notifications (2 routes)
 * - Medication interactions (2 routes)
 *
 * HIPAA Compliance: All schemas marked with PHI protection metadata
 * OpenAPI Version: 2.0/3.0 compatible using Joi schemas
 *
 * @module healthAssessments.response.schemas
 */

import Joi from 'joi';

/**
 * HEALTH RISK ASSESSMENT OBJECT SCHEMA
 * Comprehensive health risk score and analysis
 *
 * @schema HealthRiskAssessmentObject
 * @hipaa HIGHLY SENSITIVE PHI
 */
export const HealthRiskAssessmentObjectSchema = Joi.object({
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  studentName: Joi.string().example('John Doe'),
  riskScore: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .example(35)
    .description('Overall health risk score (0-100, higher = more risk)'),
  riskLevel: Joi.string()
    .valid('LOW', 'MODERATE', 'HIGH', 'CRITICAL')
    .example('MODERATE')
    .description('Categorical risk level'),
  riskFactors: Joi.array()
    .items(
      Joi.object({
        factor: Joi.string().example('Chronic asthma').description('Risk factor identified'),
        severity: Joi.string().valid('LOW', 'MODERATE', 'HIGH', 'CRITICAL').example('MODERATE'),
        impact: Joi.number().integer().example(15).description('Impact on overall risk score (0-100)')
      })
    )
    .description('Array of identified risk factors'),
  activeConditions: Joi.number()
    .integer()
    .example(2)
    .description('Number of active chronic conditions'),
  severeAllergies: Joi.number()
    .integer()
    .example(1)
    .description('Number of severe/life-threatening allergies'),
  medicationCount: Joi.number()
    .integer()
    .example(3)
    .description('Number of active medications'),
  recentIncidents: Joi.number()
    .integer()
    .example(1)
    .description('Health incidents in last 90 days'),
  recommendations: Joi.array()
    .items(Joi.string())
    .example([
      'Monitor asthma symptoms closely during physical activity',
      'Ensure EpiPen is always available and not expired',
      'Schedule follow-up appointment in 30 days'
    ])
    .description('Care recommendations based on risk assessment'),
  lastAssessmentDate: Joi.date().iso().example('2025-10-23T10:00:00Z'),
  nextReviewDate: Joi.date().iso().allow(null).example('2025-11-23T00:00:00Z')
}).label('HealthRiskAssessmentObject').description('Complete health risk assessment');

/**
 * HIGH-RISK STUDENT OBJECT SCHEMA
 * Summary of high-risk student information
 *
 * @schema HighRiskStudentObject
 * @hipaa PHI Protected
 */
export const HighRiskStudentObjectSchema = Joi.object({
  studentId: Joi.string().uuid(),
  studentName: Joi.string().example('Jane Smith'),
  riskScore: Joi.number().integer().min(0).max(100).example(72),
  riskLevel: Joi.string().valid('HIGH', 'CRITICAL').example('HIGH'),
  primaryRiskFactors: Joi.array()
    .items(Joi.string())
    .example(['Multiple severe allergies', 'Uncontrolled diabetes', 'Recent emergency incidents']),
  lastIncidentDate: Joi.date().iso().allow(null).example('2025-10-15T00:00:00Z'),
  assignedNurse: Joi.string().allow(null).example('Nurse Williams'),
  carePlanStatus: Joi.string()
    .valid('CURRENT', 'NEEDS_UPDATE', 'MISSING')
    .example('CURRENT')
}).label('HighRiskStudentObject');

/**
 * SCREENING RESULT OBJECT SCHEMA
 * Health screening result (vision, hearing, scoliosis, etc.)
 *
 * @schema ScreeningResultObject
 * @hipaa PHI Protected
 */
export const ScreeningResultObjectSchema = Joi.object({
  id: Joi.string().uuid().example('c50e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  screeningType: Joi.string()
    .valid('VISION', 'HEARING', 'SCOLIOSIS', 'DENTAL', 'BMI', 'BLOOD_PRESSURE', 'DEVELOPMENTAL')
    .example('VISION')
    .description('Type of health screening'),
  screeningDate: Joi.date().iso().example('2025-10-23T00:00:00Z'),
  result: Joi.string()
    .valid('PASS', 'FAIL', 'REFER', 'INCOMPLETE')
    .example('REFER')
    .description('Screening outcome'),
  detailedResults: Joi.object()
    .description('Screening-specific results')
    .example({
      leftEye: '20/40',
      rightEye: '20/60',
      colorVision: 'Normal',
      concerns: 'Possible myopia, recommend optometrist referral'
    }),
  followUpRequired: Joi.boolean().example(true),
  followUpNotes: Joi.string()
    .allow(null, '')
    .example('Refer to optometrist for comprehensive eye exam within 30 days'),
  parentNotified: Joi.boolean().example(true).description('Parent notification sent'),
  screenedBy: Joi.string().example('Nurse Williams'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('ScreeningResultObject').description('Health screening result record');

/**
 * GROWTH ANALYSIS OBJECT SCHEMA
 * Comprehensive growth trend analysis
 *
 * @schema GrowthAnalysisObject
 * @hipaa PHI Protected
 */
export const GrowthAnalysisObjectSchema = Joi.object({
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  studentName: Joi.string().example('Sarah Johnson'),
  ageYears: Joi.number().example(12.5).description('Current age in years'),
  currentMeasurements: Joi.object({
    height: Joi.number().example(155.5).description('Height in cm'),
    weight: Joi.number().example(48.2).description('Weight in kg'),
    bmi: Joi.number().example(20.0).description('Body Mass Index'),
    measurementDate: Joi.date().iso().example('2025-10-23T00:00:00Z')
  }),
  percentiles: Joi.object({
    heightPercentile: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .example(65)
      .description('Height percentile for age (CDC growth charts)'),
    weightPercentile: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .example(55)
      .description('Weight percentile for age'),
    bmiPercentile: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .example(60)
      .description('BMI percentile for age')
  }),
  trends: Joi.object({
    heightVelocity: Joi.string()
      .example('Normal growth velocity (5.2 cm/year)')
      .description('Growth rate assessment'),
    weightTrend: Joi.string().example('Steady, appropriate weight gain'),
    concerns: Joi.array()
      .items(Joi.string())
      .example([])
      .description('Identified growth concerns')
  }),
  clinicalInterpretation: Joi.string()
    .example('Healthy weight, normal growth pattern for age and gender'),
  recommendations: Joi.array()
    .items(Joi.string())
    .example([
      'Continue regular growth monitoring every 6 months',
      'Encourage balanced diet and physical activity',
      'No interventions needed at this time'
    ]),
  measurementHistory: Joi.array()
    .items(
      Joi.object({
        date: Joi.date().iso(),
        height: Joi.number(),
        weight: Joi.number(),
        bmi: Joi.number()
      })
    )
    .description('Historical growth measurements for trend analysis')
}).label('GrowthAnalysisObject').description('Comprehensive growth analysis');

/**
 * IMMUNIZATION FORECAST OBJECT SCHEMA
 * Upcoming immunization schedule
 *
 * @schema ImmunizationForecastObject
 * @hipaa PHI Protected
 */
export const ImmunizationForecastObjectSchema = Joi.object({
  studentId: Joi.string().uuid(),
  studentName: Joi.string().example('Michael Brown'),
  overdueVaccines: Joi.array()
    .items(
      Joi.object({
        vaccineName: Joi.string().example('Tdap booster'),
        dueDate: Joi.date().iso().example('2024-09-01T00:00:00Z'),
        daysOverdue: Joi.number().integer().example(52)
      })
    )
    .description('Vaccines that are overdue'),
  dueSoonVaccines: Joi.array()
    .items(
      Joi.object({
        vaccineName: Joi.string().example('Meningococcal conjugate'),
        dueDate: Joi.date().iso().example('2025-11-15T00:00:00Z'),
        daysUntilDue: Joi.number().integer().example(23)
      })
    )
    .description('Vaccines due within next 90 days'),
  futureVaccines: Joi.array()
    .items(
      Joi.object({
        vaccineName: Joi.string().example('HPV series (dose 2)'),
        dueDate: Joi.date().iso().example('2026-04-23T00:00:00Z')
      })
    )
    .description('Future vaccines in schedule'),
  contraindications: Joi.array()
    .items(Joi.string())
    .example([])
    .description('Known contraindications or special considerations'),
  lastUpdated: Joi.date().iso()
}).label('ImmunizationForecastObject').description('Student immunization forecast');

/**
 * EMERGENCY NOTIFICATION OBJECT SCHEMA
 * Emergency health notification record
 *
 * @schema EmergencyNotificationObject
 * @hipaa CRITICAL PHI
 */
export const EmergencyNotificationObjectSchema = Joi.object({
  id: Joi.string().uuid().example('d50e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  emergencyType: Joi.string()
    .valid('ALLERGIC_REACTION', 'ASTHMA_ATTACK', 'INJURY', 'SEIZURE', 'DIABETIC_EMERGENCY', 'OTHER')
    .example('ALLERGIC_REACTION'),
  severity: Joi.string().valid('MODERATE', 'SEVERE', 'CRITICAL').example('SEVERE'),
  description: Joi.string().example('Student experienced anaphylactic reaction to peanut exposure'),
  actionsTaken: Joi.string().example('EpiPen administered, 911 called, parent notified'),
  notifiedParties: Joi.array()
    .items(Joi.string())
    .example(['Mother (555-1234)', 'Father (555-5678)', 'Emergency Services (911)']),
  responseTime: Joi.string().example('2 minutes').description('Time from incident to action'),
  outcome: Joi.string()
    .allow(null, '')
    .example('Student stable, transported to ER by ambulance, parent en route'),
  createdAt: Joi.date().iso(),
  createdBy: Joi.string().example('Nurse Johnson')
}).label('EmergencyNotificationObject').description('Emergency health notification record');

/**
 * MEDICATION INTERACTION OBJECT SCHEMA
 * Medication interaction analysis
 *
 * @schema MedicationInteractionObject
 * @hipaa PHI Protected
 */
export const MedicationInteractionObjectSchema = Joi.object({
  interactionType: Joi.string()
    .valid('DRUG_DRUG', 'DRUG_FOOD', 'DRUG_CONDITION')
    .example('DRUG_DRUG'),
  severity: Joi.string()
    .valid('MINOR', 'MODERATE', 'MAJOR', 'SEVERE')
    .example('MODERATE'),
  medications: Joi.array()
    .items(Joi.string())
    .example(['Ibuprofen 200mg', 'Aspirin 81mg'])
    .description('Medications involved in interaction'),
  description: Joi.string()
    .example('Both medications are NSAIDs - increased risk of GI bleeding and reduced kidney function'),
  clinicalSignificance: Joi.string()
    .example('Monitor for signs of bleeding, avoid concurrent use if possible'),
  recommendations: Joi.array()
    .items(Joi.string())
    .example([
      'Consider alternative pain management',
      'If both necessary, monitor closely',
      'Take with food to reduce GI irritation'
    ])
}).label('MedicationInteractionObject');

/**
 * SUCCESS RESPONSE SCHEMAS
 */

export const HealthRiskAssessmentResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    assessment: HealthRiskAssessmentObjectSchema
  })
}).label('HealthRiskAssessmentResponse');

export const HighRiskStudentsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    students: Joi.array().items(HighRiskStudentObjectSchema),
    total: Joi.number().integer().example(12).description('Total high-risk students'),
    threshold: Joi.number().integer().example(60).description('Risk score threshold used')
  })
}).label('HighRiskStudentsResponse');

export const ScreeningResultResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    screening: ScreeningResultObjectSchema
  })
}).label('ScreeningResultResponse');

export const ScreeningHistoryResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    screenings: Joi.array().items(ScreeningResultObjectSchema),
    studentId: Joi.string().uuid()
  })
}).label('ScreeningHistoryResponse');

export const GrowthMeasurementResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    measurement: Joi.object({
      id: Joi.string().uuid(),
      height: Joi.number().example(155.5),
      weight: Joi.number().example(48.2),
      bmi: Joi.number().example(20.0),
      recordDate: Joi.date().iso()
    })
  })
}).label('GrowthMeasurementResponse');

export const GrowthAnalysisResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    analysis: GrowthAnalysisObjectSchema
  })
}).label('GrowthAnalysisResponse');

export const ImmunizationForecastResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    forecast: ImmunizationForecastObjectSchema
  })
}).label('ImmunizationForecastResponse');

export const EmergencyNotificationResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    notification: EmergencyNotificationObjectSchema,
    message: Joi.string()
      .example('Emergency notification sent successfully. All contacts notified.')
  })
}).label('EmergencyNotificationResponse');

export const EmergencyHistoryResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    emergencies: Joi.array().items(EmergencyNotificationObjectSchema),
    studentId: Joi.string().uuid()
  })
}).label('EmergencyHistoryResponse');

export const MedicationInteractionsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    interactions: Joi.array().items(MedicationInteractionObjectSchema),
    overallRisk: Joi.string()
      .valid('LOW', 'MODERATE', 'HIGH', 'CRITICAL')
      .example('MODERATE'),
    recommendations: Joi.array()
      .items(Joi.string())
      .example(['Review medication regimen with physician', 'Monitor for signs of interaction'])
  })
}).label('MedicationInteractionsResponse');

/**
 * ERROR RESPONSE SCHEMAS
 */

export const ErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Student not found'),
    code: Joi.string().optional().example('STUDENT_NOT_FOUND'),
    details: Joi.any().optional()
  })
}).label('ErrorResponse');

export const ValidationErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Validation error'),
    code: Joi.string().example('VALIDATION_ERROR'),
    details: Joi.array().items(
      Joi.object({
        field: Joi.string().example('screeningType'),
        message: Joi.string().example('Must be one of: VISION, HEARING, SCOLIOSIS, DENTAL, BMI')
      })
    )
  })
}).label('ValidationErrorResponse');

export const UnauthorizedResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Unauthorized'),
    code: Joi.string().example('UNAUTHORIZED')
  })
}).label('UnauthorizedResponse');

export const ForbiddenResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Forbidden - Requires NURSE or ADMIN role'),
    code: Joi.string().example('FORBIDDEN')
  })
}).label('ForbiddenResponse');

export const NotFoundResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Student not found'),
    code: Joi.string().example('STUDENT_NOT_FOUND')
  })
}).label('NotFoundResponse');

export const InternalErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Internal server error'),
    code: Joi.string().example('INTERNAL_ERROR')
  })
}).label('InternalErrorResponse');

/**
 * EXPORT ALL SCHEMAS
 */
export default {
  // Object Schemas
  HealthRiskAssessmentObjectSchema,
  HighRiskStudentObjectSchema,
  ScreeningResultObjectSchema,
  GrowthAnalysisObjectSchema,
  ImmunizationForecastObjectSchema,
  EmergencyNotificationObjectSchema,
  MedicationInteractionObjectSchema,

  // Success Response Schemas
  HealthRiskAssessmentResponseSchema,
  HighRiskStudentsResponseSchema,
  ScreeningResultResponseSchema,
  ScreeningHistoryResponseSchema,
  GrowthMeasurementResponseSchema,
  GrowthAnalysisResponseSchema,
  ImmunizationForecastResponseSchema,
  EmergencyNotificationResponseSchema,
  EmergencyHistoryResponseSchema,
  MedicationInteractionsResponseSchema,

  // Error Response Schemas
  ErrorResponseSchema,
  ValidationErrorResponseSchema,
  UnauthorizedResponseSchema,
  ForbiddenResponseSchema,
  NotFoundResponseSchema,
  InternalErrorResponseSchema
};
