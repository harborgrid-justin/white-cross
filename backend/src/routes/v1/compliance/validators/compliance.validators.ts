/**
 * Compliance Validators
 * Validation schemas for HIPAA compliance and regulatory management
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * Compliance Report Schemas
 */

export const complianceReportQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  reportType: Joi.string()
    .valid('HIPAA', 'FERPA', 'PRIVACY', 'SECURITY', 'BREACH', 'RISK_ASSESSMENT', 'TRAINING', 'AUDIT', 'GENERAL')
    .optional()
    .description('Filter by report type'),
  status: Joi.string()
    .valid('PENDING', 'IN_PROGRESS', 'COMPLIANT', 'NON_COMPLIANT', 'NEEDS_REVIEW')
    .optional()
    .description('Filter by compliance status'),
  period: Joi.string()
    .valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL')
    .optional()
    .description('Filter by reporting period')
});

export const createComplianceReportSchema = Joi.object({
  reportType: Joi.string()
    .valid('HIPAA', 'FERPA', 'PRIVACY', 'SECURITY', 'BREACH', 'RISK_ASSESSMENT', 'TRAINING', 'AUDIT', 'GENERAL')
    .required()
    .description('Type of compliance report'),
  title: Joi.string().trim().min(5).max(200).required()
    .description('Report title'),
  description: Joi.string().trim().max(2000).optional()
    .description('Report description'),
  period: Joi.string()
    .valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL')
    .required()
    .description('Reporting period'),
  dueDate: Joi.date().iso().min('now').optional()
    .description('Report due date')
});

export const updateComplianceReportSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'IN_PROGRESS', 'COMPLIANT', 'NON_COMPLIANT', 'NEEDS_REVIEW')
    .optional()
    .description('Update compliance status'),
  findings: Joi.object().optional()
    .description('Compliance findings'),
  recommendations: Joi.array().items(Joi.string()).optional()
    .description('Compliance recommendations'),
  submittedBy: Joi.string().uuid().optional()
    .description('User who submitted the report'),
  reviewedBy: Joi.string().uuid().optional()
    .description('User who reviewed the report')
}).min(1);

export const generateReportSchema = Joi.object({
  reportType: Joi.string()
    .valid('HIPAA', 'FERPA', 'PRIVACY', 'SECURITY', 'BREACH', 'RISK_ASSESSMENT', 'TRAINING', 'AUDIT', 'GENERAL')
    .required()
    .description('Type of report to generate'),
  period: Joi.string()
    .valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL')
    .required()
    .description('Reporting period'),
  startDate: Joi.date().iso().optional()
    .description('Custom start date (overrides period)'),
  endDate: Joi.date().iso().optional()
    .description('Custom end date (overrides period)'),
  includeRecommendations: Joi.boolean().optional().default(true)
    .description('Include automated recommendations')
});

/**
 * Checklist Schemas
 */

export const checklistQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  reportId: Joi.string().uuid().optional().description('Filter by report ID'),
  category: Joi.string().trim().optional().description('Filter by category'),
  status: Joi.string()
    .valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_APPLICABLE', 'FAILED')
    .optional()
    .description('Filter by checklist item status')
});

export const createChecklistSchema = Joi.object({
  requirement: Joi.string().trim().min(5).max(500).required()
    .description('Compliance requirement description'),
  description: Joi.string().trim().max(2000).optional()
    .description('Detailed description of requirement'),
  category: Joi.string().trim().required()
    .description('Requirement category (e.g., HIPAA_PRIVACY, HIPAA_SECURITY, FERPA)'),
  dueDate: Joi.date().iso().min('now').optional()
    .description('Requirement due date'),
  reportId: Joi.string().uuid().optional()
    .description('Associated compliance report ID')
});

export const updateChecklistSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_APPLICABLE', 'FAILED')
    .optional()
    .description('Update checklist item status'),
  evidence: Joi.string().trim().max(2000).optional()
    .description('Evidence of compliance'),
  notes: Joi.string().trim().max(2000).optional()
    .description('Additional notes'),
  completedBy: Joi.string().uuid().optional()
    .description('User who completed the item')
}).min(1);

/**
 * Consent Form Schemas
 */

export const consentFormQuerySchema = Joi.object({
  isActive: Joi.boolean().optional().description('Filter by active status')
});

export const createConsentFormSchema = Joi.object({
  type: Joi.string()
    .valid('HIPAA_AUTHORIZATION', 'FERPA_RELEASE', 'PHOTO_RELEASE', 'MEDICAL_TREATMENT', 'RESEARCH', 'EMERGENCY_CONTACT', 'GENERAL')
    .required()
    .description('Consent form type'),
  title: Joi.string().trim().min(5).max(200).required()
    .description('Consent form title'),
  description: Joi.string().trim().min(20).max(1000).required()
    .description('Consent form description'),
  content: Joi.string().trim().min(50).max(50000).required()
    .description('Full consent form content (minimum 50 characters for legal validity)'),
  version: Joi.string().trim().pattern(/^[0-9]+\.[0-9]+(\.[0-9]+)?$/).optional()
    .description('Version number (e.g., 1.0, 2.1.3)'),
  expiresAt: Joi.date().iso().min('now').optional()
    .description('Consent expiration date')
});

export const signConsentSchema = Joi.object({
  consentFormId: Joi.string().uuid().required()
    .description('Consent form to sign'),
  studentId: Joi.string().uuid().required()
    .description('Student for whom consent is given'),
  signedBy: Joi.string().trim().min(2).max(200).required()
    .description('Name of person signing consent'),
  relationship: Joi.string()
    .valid('Mother', 'Father', 'Parent', 'Legal Guardian', 'Foster Parent', 'Grandparent', 'Stepparent', 'Other Authorized Adult')
    .required()
    .description('Relationship to student'),
  signatureData: Joi.string().trim().max(100000).optional()
    .description('Digital signature data (base64 encoded image)')
});

/**
 * Policy Schemas
 */

export const policyQuerySchema = Joi.object({
  category: Joi.string()
    .valid('HIPAA_PRIVACY', 'HIPAA_SECURITY', 'FERPA', 'DATA_RETENTION', 'INCIDENT_RESPONSE', 'ACCESS_CONTROL', 'TRAINING', 'GENERAL')
    .optional()
    .description('Filter by policy category'),
  status: Joi.string()
    .valid('DRAFT', 'ACTIVE', 'ARCHIVED', 'SUPERSEDED')
    .optional()
    .description('Filter by policy status')
});

export const createPolicySchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required()
    .description('Policy title'),
  category: Joi.string()
    .valid('HIPAA_PRIVACY', 'HIPAA_SECURITY', 'FERPA', 'DATA_RETENTION', 'INCIDENT_RESPONSE', 'ACCESS_CONTROL', 'TRAINING', 'GENERAL')
    .required()
    .description('Policy category'),
  content: Joi.string().trim().min(100).max(100000).required()
    .description('Full policy content (minimum 100 characters)'),
  version: Joi.string().trim().pattern(/^[0-9]+\.[0-9]+(\.[0-9]+)?$/).optional()
    .description('Version number (e.g., 1.0, 2.1.3)'),
  effectiveDate: Joi.date().iso().required()
    .description('Policy effective date'),
  reviewDate: Joi.date().iso().min(Joi.ref('effectiveDate')).optional()
    .description('Next policy review date')
});

export const updatePolicySchema = Joi.object({
  status: Joi.string()
    .valid('DRAFT', 'ACTIVE', 'ARCHIVED', 'SUPERSEDED')
    .optional()
    .description('Update policy status'),
  approvedBy: Joi.string().uuid().optional()
    .description('User who approved the policy'),
  reviewDate: Joi.date().iso().optional()
    .description('Next review date')
}).min(1);

/**
 * Statistics Schemas
 */

export const complianceStatisticsQuerySchema = Joi.object({
  period: Joi.string()
    .valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM')
    .optional()
    .default('MONTHLY')
    .description('Statistics period'),
  startDate: Joi.date().iso().optional()
    .description('Custom start date (required if period is CUSTOM)'),
  endDate: Joi.date().iso().optional()
    .description('Custom end date (required if period is CUSTOM)')
});

/**
 * Parameter Schemas
 */

export const reportIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().description('Compliance report ID')
});

export const checklistIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().description('Checklist item ID')
});

export const consentFormIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().description('Consent form ID')
});

export const studentIdParamSchema = Joi.object({
  studentId: Joi.string().uuid().required().description('Student ID')
});

export const policyIdParamSchema = Joi.object({
  policyId: Joi.string().uuid().required().description('Policy ID')
});

export const signatureIdParamSchema = Joi.object({
  signatureId: Joi.string().uuid().required().description('Consent signature ID')
});
