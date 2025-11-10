/**
 * Clinical Types and Interfaces
 *
 * Type definitions for clinical orders, results, assessments, diagnoses,
 * and clinical decision support.
 *
 * @module clinical.types
 * @since 1.0.0
 */

import { PriorityLevel, EntityStatus } from './common.types';

/**
 * Clinical order types
 */
export type ClinicalOrderType =
  | 'LABORATORY'
  | 'RADIOLOGY'
  | 'MEDICATION'
  | 'PROCEDURE'
  | 'CONSULTATION'
  | 'NURSING'
  | 'DIET'
  | 'OTHER';

/**
 * Clinical order
 *
 * @example
 * ```typescript
 * const order: ClinicalOrder = {
 *   orderId: 'ORD-123',
 *   patientId: 'PAT-456',
 *   orderType: 'LABORATORY',
 *   orderName: 'Complete Blood Count (CBC)',
 *   orderingProvider: 'Dr. Smith',
 *   orderDate: new Date(),
 *   priority: 'routine',
 *   status: 'active'
 * };
 * ```
 */
export interface ClinicalOrder {
  orderId: string;
  patientId: string;
  encounterId?: string;
  orderType: ClinicalOrderType;
  orderName: string;
  orderCode?: string;
  orderingProvider: string;
  orderingProviderNPI?: string;
  orderDate: Date;
  scheduledDate?: Date;
  priority: PriorityLevel;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  indication?: string;
  clinicalNotes?: string;
  specimenType?: string;
  specimenSource?: string;
  fastingRequired?: boolean;
  instructions?: string;
}

/**
 * Laboratory result
 *
 * @example
 * ```typescript
 * const result: LabResult = {
 *   resultId: 'RES-123',
 *   orderId: 'ORD-456',
 *   patientId: 'PAT-789',
 *   testName: 'Glucose',
 *   value: '105',
 *   unit: 'mg/dL',
 *   referenceRange: '70-110',
 *   abnormalFlag: false,
 *   resultDate: new Date(),
 *   status: 'final'
 * };
 * ```
 */
export interface LabResult {
  resultId: string;
  orderId: string;
  patientId: string;
  testName: string;
  testCode?: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  abnormalFlag: boolean;
  criticalFlag?: boolean;
  resultDate: Date;
  reportedDate?: Date;
  status: 'preliminary' | 'final' | 'corrected' | 'cancelled';
  performingLab?: string;
  performingTechnician?: string;
  reviewingProvider?: string;
  notes?: string;
}

/**
 * Diagnosis
 *
 * @example
 * ```typescript
 * const diagnosis: Diagnosis = {
 *   diagnosisId: 'DX-123',
 *   patientId: 'PAT-456',
 *   diagnosisCode: 'E11.9',
 *   diagnosisName: 'Type 2 Diabetes Mellitus',
 *   diagnosisType: 'primary',
 *   onsetDate: new Date('2020-05-15'),
 *   status: 'active'
 * };
 * ```
 */
export interface Diagnosis {
  diagnosisId: string;
  patientId: string;
  encounterId?: string;
  diagnosisCode: string;
  codingSystem: 'ICD-10' | 'ICD-9' | 'SNOMED-CT';
  diagnosisName: string;
  diagnosisType: 'primary' | 'secondary' | 'admitting' | 'discharge';
  onsetDate?: Date;
  diagnosedDate?: Date;
  diagnosedBy?: string;
  status: EntityStatus;
  severity?: 'mild' | 'moderate' | 'severe';
  certainty?: 'confirmed' | 'suspected' | 'ruled_out';
  notes?: string;
}

/**
 * Clinical assessment
 *
 * @example
 * ```typescript
 * const assessment: ClinicalAssessment = {
 *   assessmentId: 'ASSESS-123',
 *   patientId: 'PAT-456',
 *   encounterId: 'ENC-789',
 *   assessmentType: 'nursing',
 *   assessmentDate: new Date(),
 *   assessedBy: 'Nurse Johnson',
 *   findings: 'Patient alert and oriented x3',
 *   riskFactors: ['Fall risk', 'Pressure ulcer risk']
 * };
 * ```
 */
export interface ClinicalAssessment {
  assessmentId: string;
  patientId: string;
  encounterId: string;
  assessmentType: 'nursing' | 'physician' | 'pain' | 'fall_risk' | 'nutritional' | 'other';
  assessmentDate: Date;
  assessedBy: string;
  findings: string;
  riskFactors?: string[];
  scores?: Record<string, number>;
  recommendations?: string[];
  followUpRequired?: boolean;
  followUpDate?: Date;
  notes?: string;
}

/**
 * Clinical decision support alert
 *
 * @example
 * ```typescript
 * const alert: CDSAlert = {
 *   alertId: 'ALERT-123',
 *   patientId: 'PAT-456',
 *   alertType: 'drug_interaction',
 *   severity: 'high',
 *   title: 'Drug-Drug Interaction Detected',
 *   message: 'Warfarin and Aspirin: Increased bleeding risk',
 *   recommendation: 'Monitor INR closely',
 *   requiresAcknowledgment: true,
 *   createdDate: new Date()
 * };
 * ```
 */
export interface CDSAlert {
  alertId: string;
  patientId: string;
  encounterId?: string;
  alertType: 'drug_interaction' | 'drug_allergy' | 'duplicate_therapy' | 'dosing' | 'lab_value' | 'guideline' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  recommendation?: string;
  requiresAcknowledgment: boolean;
  acknowledgedBy?: string;
  acknowledgedDate?: Date;
  overrideReason?: string;
  createdDate: Date;
  expirationDate?: Date;
  source?: string;
  references?: string[];
}

/**
 * Procedure information
 *
 * @example
 * ```typescript
 * const procedure: ProcedureInfo = {
 *   procedureId: 'PROC-123',
 *   patientId: 'PAT-456',
 *   procedureName: 'Appendectomy',
 *   procedureCode: 'CPT-44950',
 *   scheduledDate: new Date(),
 *   performingProvider: 'Dr. Surgeon',
 *   status: 'scheduled'
 * };
 * ```
 */
export interface ProcedureInfo {
  procedureId: string;
  patientId: string;
  encounterId?: string;
  procedureName: string;
  procedureCode: string;
  codingSystem: 'CPT' | 'ICD-10-PCS' | 'HCPCS' | 'SNOMED-CT';
  scheduledDate?: Date;
  performedDate?: Date;
  performingProvider?: string;
  assistingProviders?: string[];
  location?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  indication?: string;
  findings?: string;
  complications?: string[];
  anesthesiaType?: string;
  duration?: number;
  notes?: string;
}
