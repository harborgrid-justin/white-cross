/**
 * Health Assessments Validators
 * Joi validation schemas for health risk assessments, screenings, growth tracking, and emergency notifications
 */

import Joi from 'joi';

/**
 * COMMON PARAMETER SCHEMAS
 */

export const healthRiskParamSchema = Joi.object({
  studentId: Joi.string().uuid().required()
});

/**
 * HEALTH RISK ASSESSMENT SCHEMAS
 */

export const healthRiskQuerySchema = Joi.object({
  minScore: Joi.number().min(0).max(100).default(50),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

/**
 * SCREENING SCHEMAS
 */

export const recordScreeningSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  screeningType: Joi.string().valid(
    'vision', 
    'hearing', 
    'scoliosis', 
    'dental', 
    'bmi',
    'blood-pressure',
    'general-physical',
    'developmental'
  ).required(),
  results: Joi.object({
    passed: Joi.boolean().required(),
    measurements: Joi.object().optional(),
    observations: Joi.string().max(1000).optional(),
    abnormalFindings: Joi.array().items(Joi.string()).optional(),
    referralNeeded: Joi.boolean().default(false)
  }).required(),
  recommendations: Joi.array().items(Joi.string().max(200)).optional(),
  followUpRequired: Joi.boolean().default(false),
  followUpDate: Joi.date().min('now').when('followUpRequired', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  screeningDate: Joi.date().max('now').default(() => new Date()).description('current date'),
  notes: Joi.string().max(1000).optional(),
  parentNotificationRequired: Joi.boolean().default(false),
  urgency: Joi.string().valid('low', 'medium', 'high').default('low')
});

/**
 * GROWTH MEASUREMENT SCHEMAS
 */

export const growthMeasurementSchema = Joi.object({
  height: Joi.number().positive().precision(2).min(20).max(250).required()
    .description('Height in centimeters'),
  weight: Joi.number().positive().precision(2).min(1).max(300).required()
    .description('Weight in kilograms'),
  bmi: Joi.number().positive().precision(2).min(8).max(60).optional()
    .description('BMI - will be calculated if not provided'),
  headCircumference: Joi.number().positive().precision(2).min(25).max(70).optional()
    .description('Head circumference in centimeters (typically for ages 0-3)'),
  measurementDate: Joi.date().max('now').default(() => new Date()).description('current date'),
  measurementMethod: Joi.string().valid(
    'digital-scale', 
    'mechanical-scale', 
    'stadiometer', 
    'measuring-tape',
    'portable-scale'
  ).default('digital-scale'),
  notes: Joi.string().max(500).optional(),
  witnessed: Joi.boolean().default(false),
  witnessId: Joi.string().uuid().when('witnessed', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

export const growthAnalysisQuerySchema = Joi.object({
  period: Joi.string().valid('6months', '1year', '2years', '5years', 'all').default('1year'),
  includePercentiles: Joi.boolean().default(true),
  includeTrends: Joi.boolean().default(true),
  compareToNorms: Joi.boolean().default(true)
});

/**
 * EMERGENCY NOTIFICATION SCHEMAS
 */

export const emergencyNotificationSchema = Joi.object({
  studentId: Joi.string().uuid().optional()
    .description('Student ID if emergency involves a specific student'),
  emergencyType: Joi.string().valid(
    'medical-emergency',
    'allergic-reaction', 
    'injury-serious',
    'injury-minor',
    'behavioral-crisis',
    'medication-error',
    'seizure',
    'asthma-attack',
    'diabetic-emergency',
    'mental-health-crisis',
    'other'
  ).required(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
  description: Joi.string().min(10).max(1000).required()
    .description('Detailed description of the emergency situation'),
  location: Joi.string().min(3).max(200).required()
    .description('Specific location where emergency occurred'),
  immediateActions: Joi.array().items(
    Joi.string().max(200)
  ).min(1).optional()
    .description('Immediate actions taken'),
  vitals: Joi.object({
    bloodPressure: Joi.string().pattern(/^\d{2,3}\/\d{2,3}$/).optional(),
    heartRate: Joi.number().min(30).max(200).optional(),
    respiratoryRate: Joi.number().min(5).max(50).optional(),
    temperature: Joi.number().min(95).max(110).optional(),
    oxygenSaturation: Joi.number().min(70).max(100).optional(),
    consciousnessLevel: Joi.string().valid('alert', 'drowsy', 'confused', 'unconscious').optional()
  }).optional(),
  notifyContacts: Joi.array().items(
    Joi.string().valid(
      'parents-guardians',
      'emergency-contacts', 
      'medical-staff',
      'administration',
      'district-office',
      'ems',
      'police'
    )
  ).min(1).default(['parents-guardians']),
  followUpRequired: Joi.boolean().default(true),
  incidentReportNumber: Joi.string().optional()
    .description('Reference to related incident report'),
  witnesses: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      role: Joi.string().required(),
      contactInfo: Joi.string().optional()
    })
  ).optional()
});

/**
 * IMMUNIZATION FORECAST SCHEMAS
 */

export const immunizationForecastQuerySchema = Joi.object({
  forecastPeriod: Joi.number().min(1).max(365).default(90)
    .description('Number of days to forecast ahead'),
  includeOverdue: Joi.boolean().default(true),
  includeFuture: Joi.boolean().default(true),
  ageGroup: Joi.string().valid(
    'infant', 
    'toddler', 
    'preschool', 
    'school-age', 
    'adolescent',
    'all'
  ).default('all')
});

/**
 * MEDICATION INTERACTION SCHEMAS
 */

export const medicationInteractionPayloadSchema = Joi.object({
  medicationName: Joi.string().min(1).max(200).required(),
  dosage: Joi.string().max(50).optional(),
  frequency: Joi.string().max(50).optional(),
  route: Joi.string().valid(
    'oral',
    'topical', 
    'injection',
    'inhalation',
    'nasal',
    'rectal',
    'sublingual'
  ).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional()
});

/**
 * EXPORT VALIDATION FUNCTIONS
 */

export const validateHealthRiskParams = (params: any) => {
  return healthRiskParamSchema.validate(params);
};

export const validateHealthRiskQuery = (query: any) => {
  return healthRiskQuerySchema.validate(query);
};

export const validateRecordScreening = (payload: any) => {
  return recordScreeningSchema.validate(payload);
};

export const validateGrowthMeasurement = (payload: any) => {
  return growthMeasurementSchema.validate(payload);
};

export const validateGrowthAnalysisQuery = (query: any) => {
  return growthAnalysisQuerySchema.validate(query);
};

export const validateEmergencyNotification = (payload: any) => {
  return emergencyNotificationSchema.validate(payload);
};

export const validateImmunizationForecastQuery = (query: any) => {
  return immunizationForecastQuerySchema.validate(query);
};

export const validateMedicationInteractionPayload = (payload: any) => {
  return medicationInteractionPayloadSchema.validate(payload);
};
