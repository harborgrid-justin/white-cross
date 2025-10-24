/**
 * Health Assessments Routes - Enhanced with Comprehensive Swagger Documentation
 * HTTP endpoints for health risk assessments, screenings, growth tracking, and emergency notifications
 * All routes prefixed with /api/v1/health-assessments
 *
 * Swagger/OpenAPI Documentation:
 * - Complete request/response schemas for all 11 assessment endpoints
 * - HIPAA compliance notes for all PHI-protected endpoints
 * - Detailed schemas for risk assessments, screenings, growth analysis, and immunization forecasts
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { asyncHandler } from '../../../shared/utils';
import { HealthAssessmentsController } from '../controllers/healthAssessments.controller';
import {
  healthRiskParamSchema,
  healthRiskQuerySchema,
  recordScreeningSchema,
  growthMeasurementSchema,
  growthAnalysisQuerySchema,
  emergencyNotificationSchema,
  immunizationForecastQuerySchema
} from '../validators/healthAssessments.validators';

/**
 * SWAGGER SCHEMA COMPONENTS
 * Reusable response schemas for health assessments documentation
 */

const healthRiskAssessmentSchema = Joi.object({
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  studentName: Joi.string().example('John Doe'),
  riskScore: Joi.number().integer().min(0).max(100).example(35).description('Overall health risk score (0-100, higher = more risk)'),
  riskLevel: Joi.string().valid('LOW', 'MODERATE', 'HIGH', 'CRITICAL').example('MODERATE'),
  riskFactors: Joi.array().items(
    Joi.object({
      factor: Joi.string().example('Chronic asthma'),
      severity: Joi.string().valid('LOW', 'MODERATE', 'HIGH', 'CRITICAL').example('MODERATE'),
      impact: Joi.number().integer().example(15).description('Impact on overall risk score')
    })
  ).description('Array of identified risk factors'),
  activeConditions: Joi.number().integer().example(2).description('Number of active chronic conditions'),
  severeAllergies: Joi.number().integer().example(1).description('Number of severe/life-threatening allergies'),
  medicationCount: Joi.number().integer().example(3).description('Number of active medications'),
  recentIncidents: Joi.number().integer().example(1).description('Health incidents in last 90 days'),
  recommendations: Joi.array().items(Joi.string()).example(['Monitor asthma symptoms closely', 'Ensure EpiPen is always available', 'Schedule follow-up in 30 days']),
  lastAssessmentDate: Joi.date().iso().example('2025-10-23T10:00:00Z'),
  nextReviewDate: Joi.date().iso().allow(null).example('2025-11-23')
}).label('HealthRiskAssessment');

const screeningResultSchema = Joi.object({
  id: Joi.string().uuid().example('c50e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  screeningType: Joi.string().valid('VISION', 'HEARING', 'SCOLIOSIS', 'DENTAL', 'BMI', 'BLOOD_PRESSURE', 'DEVELOPMENTAL').example('VISION'),
  screeningDate: Joi.date().iso().example('2025-10-23'),
  result: Joi.string().valid('PASS', 'FAIL', 'REFER', 'INCOMPLETE').example('REFER'),
  detailedResults: Joi.object().description('Screening-specific results').example({
    leftEye: '20/40',
    rightEye: '20/60',
    colorVision: 'Normal'
  }),
  followUpRequired: Joi.boolean().example(true),
  followUpNotes: Joi.string().allow(null, '').example('Refer to optometrist for comprehensive eye exam'),
  parentNotified: Joi.boolean().example(true),
  screenedBy: Joi.string().example('Nurse Williams'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('ScreeningResult');

const growthAnalysisSchema = Joi.object({
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  studentName: Joi.string().example('Sarah Johnson'),
  ageYears: Joi.number().example(12.5).description('Current age in years'),
  currentMeasurements: Joi.object({
    height: Joi.number().example(155.5).description('Height in cm'),
    weight: Joi.number().example(48.2).description('Weight in kg'),
    bmi: Joi.number().example(20.0).description('Body Mass Index'),
    measurementDate: Joi.date().iso().example('2025-10-23')
  }),
  percentiles: Joi.object({
    heightPercentile: Joi.number().integer().min(0).max(100).example(65).description('Height percentile for age'),
    weightPercentile: Joi.number().integer().min(0).max(100).example(55).description('Weight percentile for age'),
    bmiPercentile: Joi.number().integer().min(0).max(100).example(60).description('BMI percentile for age')
  }),
  trends: Joi.object({
    heightVelocity: Joi.string().example('Normal growth velocity').description('Growth rate assessment'),
    weightTrend: Joi.string().example('Steady, appropriate weight gain'),
    concerns: Joi.array().items(Joi.string()).example([])
  }),
  clinicalInterpretation: Joi.string().example('Healthy weight, normal growth pattern for age'),
  recommendations: Joi.array().items(Joi.string()).example(['Continue regular monitoring', 'Encourage balanced diet and physical activity']),
  measurementHistory: Joi.array().items(
    Joi.object({
      date: Joi.date().iso(),
      height: Joi.number(),
      weight: Joi.number(),
      bmi: Joi.number()
    })
  ).description('Historical growth measurements')
}).label('GrowthAnalysis');

const errorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Student not found'),
    code: Joi.string().optional().example('STUDENT_NOT_FOUND'),
    details: Joi.any().optional()
  })
}).label('ErrorResponse');

/**
 * HEALTH RISK ASSESSMENT ROUTES
 */

const getHealthRiskRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-assessments/risk/{studentId}',
  handler: asyncHandler(HealthAssessmentsController.getHealthRisk),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Healthcare', 'v1'],
    description: 'Calculate health risk score for a student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns comprehensive health risk assessment including risk factors, chronic conditions impact, medication interactions, and recommendations. Used for care planning and intervention prioritization. HIPAA Compliance: All access is logged.',
    validate: {
      params: healthRiskParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Health risk assessment calculated successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                assessment: healthRiskAssessmentSchema
              })
            }).label('GetHealthRiskResponse')
          },
          '401': { description: 'Unauthorized', schema: errorResponseSchema },
          '404': { description: 'Student not found', schema: errorResponseSchema },
          '500': { description: 'Internal server error', schema: errorResponseSchema }
        }
      }
    }
  }
};

const getHighRiskStudentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-assessments/high-risk-students',
  handler: asyncHandler(HealthAssessmentsController.getHighRiskStudents),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Healthcare', 'Administration', 'v1'],
    description: 'Get list of high-risk students',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns students with health risk scores above the specified threshold. Includes risk factors, priority interventions needed, and care team assignments. Used for proactive health management.',
    validate: {
      query: healthRiskQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'High-risk students retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE or ADMIN role' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * HEALTH SCREENINGS ROUTES
 */

const recordScreeningRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/health-assessments/screenings',
  handler: asyncHandler(HealthAssessmentsController.recordScreening),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Screenings', 'Healthcare', 'v1'],
    description: 'Record health screening results',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Records various types of health screening results (vision, hearing, scoliosis, dental, BMI). Includes pass/fail status, detailed results, follow-up recommendations, and parent notification requirements. Critical for early intervention.',
    validate: {
      payload: recordScreeningSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Health screening recorded successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE role' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getScreeningHistoryRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-assessments/screenings/{studentId}',
  handler: asyncHandler(HealthAssessmentsController.getScreeningHistory),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Screenings', 'Healthcare', 'v1'],
    description: 'Get screening history for a student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns complete screening history for a student including trends, follow-up status, and intervention outcomes. Used for longitudinal health monitoring.',
    validate: {
      params: healthRiskParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Screening history retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * GROWTH TRACKING ROUTES
 */

const recordGrowthMeasurementRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/health-assessments/growth/{studentId}',
  handler: asyncHandler(HealthAssessmentsController.recordGrowthMeasurement),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Growth', 'Healthcare', 'v1'],
    description: 'Record growth measurement for student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Records height, weight, BMI, and other growth measurements. Automatically calculates percentiles and flags concerning trends. Supports head circumference for younger students. Critical for monitoring developmental health.',
    validate: {
      params: healthRiskParamSchema,
      payload: growthMeasurementSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Growth measurement recorded successfully' },
          '400': { description: 'Validation error or measurement outside normal ranges' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE role' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getGrowthAnalysisRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-assessments/growth/{studentId}/analysis',
  handler: asyncHandler(HealthAssessmentsController.getGrowthAnalysis),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Growth', 'Healthcare', 'v1'],
    description: 'Analyze growth trends for student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Provides comprehensive growth trend analysis including percentile tracking, velocity calculations, and clinical recommendations. Identifies concerning patterns like growth faltering or excessive weight gain.',
    validate: {
      params: healthRiskParamSchema,
      query: growthAnalysisQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Growth analysis generated successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found or insufficient data' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * IMMUNIZATION FORECAST ROUTES
 */

const getImmunizationForecastRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-assessments/immunizations/{studentId}/forecast',
  handler: asyncHandler(HealthAssessmentsController.getImmunizationForecast),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Immunizations', 'Healthcare', 'v1'],
    description: 'Get immunization forecast for student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Generates immunization schedule based on current status, age, and CDC guidelines. Shows overdue, due soon, and future immunizations. Includes contraindication checking and catch-up schedules.',
    validate: {
      params: healthRiskParamSchema,
      query: immunizationForecastQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Immunization forecast generated successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * EMERGENCY NOTIFICATION ROUTES
 */

const sendEmergencyNotificationRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/health-assessments/emergency/notify',
  handler: asyncHandler(HealthAssessmentsController.sendEmergencyNotification),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Emergency', 'Healthcare', 'v1'],
    description: 'Send emergency health notification',
    notes: '**CRITICAL PHI ENDPOINT** - Triggers emergency notification system for urgent health situations. Automatically contacts parents, emergency contacts, and medical staff based on severity. Creates incident report and audit trail. Used for medical emergencies, allergic reactions, and serious injuries.',
    validate: {
      payload: emergencyNotificationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Emergency notification sent successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE role' },
          '500': { description: 'Internal server error - Emergency protocols activated' }
        }
      }
    }
  }
};

const getEmergencyHistoryRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-assessments/emergency/{studentId}',
  handler: asyncHandler(HealthAssessmentsController.getEmergencyHistory),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Emergency', 'Healthcare', 'v1'],
    description: 'Get emergency notification history for student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns history of emergency notifications for a student including incident details, response times, and outcomes. Critical for pattern recognition and care planning.',
    validate: {
      params: healthRiskParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Emergency history retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * MEDICATION INTERACTIONS ROUTES (Extended from medications module)
 */

const getMedicationInteractionsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-assessments/medication-interactions/{studentId}',
  handler: asyncHandler(HealthAssessmentsController.getMedicationInteractions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Medications', 'Healthcare', 'v1'],
    description: 'Check comprehensive medication interactions for student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Analyzes all current medications, supplements, and known allergies for potential interactions. Includes drug-drug, drug-food, and drug-condition interactions. More comprehensive than basic medication checking.',
    validate: {
      params: healthRiskParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Medication interactions analyzed successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const checkNewMedicationInteractionsRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/health-assessments/medication-interactions/{studentId}/check',
  handler: asyncHandler(HealthAssessmentsController.checkNewMedicationInteractions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Health Assessments', 'Medications', 'Healthcare', 'v1'],
    description: 'Check interactions for a potential new medication',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Validates potential interactions before adding a new medication to student\'s regimen. Includes severity assessment, clinical significance, and management recommendations.',
    validate: {
      params: healthRiskParamSchema,
      payload: {
        medicationName: require('joi').string().min(1).max(200).required(),
        dosage: require('joi').string().optional(),
        frequency: require('joi').string().optional()
      }
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'New medication interactions checked successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE role' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * EXPORT ALL ROUTES
 */

export const healthAssessmentsRoutes: ServerRoute[] = [
  // Health Risk Assessment (2 routes)
  getHealthRiskRoute,
  getHighRiskStudentsRoute,

  // Health Screenings (2 routes)
  recordScreeningRoute,
  getScreeningHistoryRoute,

  // Growth Tracking (2 routes)
  recordGrowthMeasurementRoute,
  getGrowthAnalysisRoute,

  // Immunization Forecast (1 route)
  getImmunizationForecastRoute,

  // Emergency Notifications (2 routes)
  sendEmergencyNotificationRoute,
  getEmergencyHistoryRoute,

  // Extended Medication Interactions (2 routes)
  getMedicationInteractionsRoute,
  checkNewMedicationInteractionsRoute
];
