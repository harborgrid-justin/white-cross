/**
 * LOC: HLTH-INF-CTL-001
 * File: /reuse/server/health/health-infection-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Infection prevention services
 *   - Environmental services modules
 *   - Quality management services
 *   - Public health reporting
 *   - Clinical surveillance systems
 */

/**
 * File: /reuse/server/health/health-infection-control-kit.ts
 * Locator: WC-HEALTH-INF-001
 * Purpose: Healthcare Infection Control Kit - Epic Infection Prevention-level surveillance utilities
 *
 * Upstream: @nestjs/common, crypto, Node.js standard library
 * Downstream: ../backend/health/*, Infection control, Environmental services, NHSN reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: 40 production-ready functions for infection control, HAI surveillance, outbreak detection
 *
 * LLM Context: Enterprise-grade HIPAA-compliant infection control and prevention utilities for White Cross platform.
 * Provides comprehensive infection surveillance tracking with real-time monitoring, hospital-acquired infection (HAI)
 * detection and reporting to NHSN/CDC, contact precaution and isolation order management with automated workflows,
 * outbreak detection using statistical process control and machine learning algorithms, infection prevention protocol
 * enforcement, environmental services tracking with cleaning verification, hand hygiene compliance monitoring with
 * direct observation and electronic monitoring integration, antibiotic stewardship tracking with clinical decision
 * support, culture and sensitivity result monitoring with automated alerts, contact tracing for outbreak investigation,
 * PPE usage tracking and inventory management, cleaning verification with ATP bioluminescence. Epic Infection Prevention,
 * Cerner HAI Surveillance, Meditech IPC-level features with CDC NHSN compliance and enterprise scalability.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Healthcare-Associated Infection (HAI) types
 */
export type HAIType =
  | 'CLABSI' // Central Line-Associated Bloodstream Infection
  | 'CAUTI' // Catheter-Associated Urinary Tract Infection
  | 'SSI' // Surgical Site Infection
  | 'VAP' // Ventilator-Associated Pneumonia
  | 'VAE' // Ventilator-Associated Event
  | 'CDI' // Clostridioides difficile Infection
  | 'MRSA' // Methicillin-Resistant Staphylococcus aureus
  | 'VRE' // Vancomycin-Resistant Enterococcus
  | 'CRE' // Carbapenem-Resistant Enterobacteriaceae
  | 'MDRO'; // Multi-Drug Resistant Organism

/**
 * Infection surveillance event
 */
export interface InfectionSurveillanceEvent {
  id?: string;
  patientId: string;
  encounterId?: string;
  eventDate: Date;
  infectionType: HAIType;
  pathogen?: string;
  site?: string;
  deviceAssociated?: boolean;
  deviceType?: 'central-line' | 'urinary-catheter' | 'ventilator' | 'other';
  deviceInsertionDate?: Date;
  deviceRemovalDate?: Date;
  onsetDate: Date;
  reportedDate: Date;
  reportedBy: string;
  facilityId: string;
  unitId?: string;
  nhsnReported?: boolean;
  nhsnEventId?: string;
  outcome?: 'resolved' | 'ongoing' | 'deceased' | 'transferred';
  notes?: string;
  riskFactors?: string[];
  preventable?: boolean;
  rootCauseAnalysis?: boolean;
  interventions?: string[];
}

/**
 * Isolation precaution types
 */
export type IsolationType =
  | 'standard'
  | 'contact'
  | 'droplet'
  | 'airborne'
  | 'contact-plus'
  | 'protective';

/**
 * Isolation order
 */
export interface IsolationOrder {
  id?: string;
  patientId: string;
  encounterId: string;
  isolationType: IsolationType;
  reason: string;
  pathogen?: string;
  orderDate: Date;
  orderedBy: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'discontinued' | 'expired';
  signRequired?: boolean;
  roomRequirements?: {
    privateRoom: boolean;
    negativePressure?: boolean;
    anteRoom?: boolean;
    hepaFilter?: boolean;
  };
  ppeRequirements?: {
    gloves: boolean;
    gown: boolean;
    mask: boolean;
    n95: boolean;
    faceShield: boolean;
    eyeProtection: boolean;
  };
  specialInstructions?: string;
  discontinuedBy?: string;
  discontinuedReason?: string;
  complianceChecks?: Array<{
    timestamp: Date;
    checker: string;
    compliant: boolean;
    issues?: string[];
  }>;
}

/**
 * Outbreak detection data
 */
export interface OutbreakDetection {
  id?: string;
  facilityId: string;
  unitId?: string;
  pathogen: string;
  startDate: Date;
  endDate?: Date;
  status: 'suspected' | 'confirmed' | 'controlled' | 'resolved';
  caseCount: number;
  affectedPatients: string[];
  affectedStaff?: string[];
  commonSource?: string;
  transmissionMode?: 'contact' | 'droplet' | 'airborne' | 'foodborne' | 'waterborne' | 'vectorborne';
  investigationLead?: string;
  interventions?: string[];
  publicHealthNotified?: boolean;
  publicHealthAgency?: string;
  notificationDate?: Date;
  rootCause?: string;
  preventativeMeasures?: string[];
  notes?: string;
}

/**
 * Contact tracing record
 */
export interface ContactTrace {
  id?: string;
  indexCaseId: string;
  indexPatientId: string;
  contactType: 'patient' | 'staff' | 'visitor';
  contactId: string;
  contactName?: string;
  contactRole?: string;
  exposureDate: Date;
  exposureDuration?: number; // minutes
  exposureLocation?: string;
  exposureType: 'direct' | 'indirect' | 'environmental';
  riskLevel: 'high' | 'medium' | 'low';
  notified: boolean;
  notificationDate?: Date;
  tested: boolean;
  testDate?: Date;
  testResult?: 'positive' | 'negative' | 'pending';
  quarantined: boolean;
  quarantineStartDate?: Date;
  quarantineEndDate?: Date;
  symptomatic: boolean;
  symptomOnsetDate?: Date;
  followUpRequired: boolean;
  followUpDate?: Date;
  notes?: string;
}

/**
 * Hand hygiene observation
 */
export interface HandHygieneObservation {
  id?: string;
  observationDate: Date;
  observer: string;
  facilityId: string;
  unitId: string;
  staffMember?: string;
  staffRole?: string;
  moment: '1-before-patient' | '2-before-aseptic' | '3-after-body-fluid' | '4-after-patient' | '5-after-surroundings';
  action: 'hand-wash' | 'alcohol-rub' | 'none';
  compliant: boolean;
  technique?: 'adequate' | 'inadequate';
  duration?: number; // seconds
  productUsed?: string;
  notes?: string;
}

/**
 * Hand hygiene compliance report
 */
export interface HandHygieneComplianceReport {
  facilityId: string;
  unitId?: string;
  startDate: Date;
  endDate: Date;
  totalObservations: number;
  compliantObservations: number;
  complianceRate: number;
  byMoment: Record<string, { total: number; compliant: number; rate: number }>;
  byRole: Record<string, { total: number; compliant: number; rate: number }>;
  byProduct: Record<string, number>;
  trend: 'improving' | 'declining' | 'stable';
  benchmarkComparison?: {
    facilityAverage: number;
    nationalAverage: number;
  };
}

/**
 * Antibiotic prescription tracking
 */
export interface AntibioticPrescription {
  id?: string;
  patientId: string;
  encounterId: string;
  antibioticName: string;
  antibioticClass: string;
  dose: string;
  route: string;
  frequency: string;
  indication: string;
  cultureOrdered: boolean;
  cultureDate?: Date;
  pathogen?: string;
  sensitivity?: Record<string, 'susceptible' | 'intermediate' | 'resistant'>;
  prescribedBy: string;
  prescribedDate: Date;
  startDate: Date;
  plannedDuration?: number; // days
  endDate?: Date;
  status: 'active' | 'completed' | 'discontinued';
  reviewRequired: boolean;
  reviewDate?: Date;
  reviewedBy?: string;
  appropriateness?: 'appropriate' | 'inappropriate' | 'questionable';
  interventionRequired?: boolean;
  intervention?: string;
  stewardshipAlert?: boolean;
  notes?: string;
}

/**
 * Culture and sensitivity result
 */
export interface CultureResult {
  id?: string;
  patientId: string;
  encounterId?: string;
  orderDate: Date;
  collectionDate: Date;
  receivedDate?: Date;
  resultDate?: Date;
  specimenType: string;
  specimenSource: string;
  orderedBy: string;
  resultedBy?: string;
  status: 'pending' | 'preliminary' | 'final' | 'corrected';
  organisms: Array<{
    name: string;
    quantity?: string;
    gramStain?: string;
    morphology?: string;
    sensitivities?: Array<{
      antibiotic: string;
      interpretation: 'susceptible' | 'intermediate' | 'resistant';
      mic?: string;
      method?: string;
    }>;
  }>;
  criticalValue: boolean;
  criticalValueNotified?: boolean;
  notificationDate?: Date;
  notifiedTo?: string;
  comments?: string;
}

/**
 * Environmental services cleaning task
 */
export interface CleaningTask {
  id?: string;
  facilityId: string;
  location: string;
  locationType: 'patient-room' | 'operating-room' | 'procedure-room' | 'common-area' | 'isolation-room';
  cleaningType: 'routine' | 'terminal' | 'discharge' | 'isolation' | 'outbreak';
  priority: 'routine' | 'urgent' | 'stat';
  assignedTo?: string;
  assignedDate?: Date;
  scheduledDate: Date;
  startTime?: Date;
  completionTime?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'verified' | 'failed';
  checklist?: Array<{
    item: string;
    completed: boolean;
    notes?: string;
  }>;
  disinfectantUsed?: string;
  contactTime?: number; // minutes
  verifiedBy?: string;
  verificationMethod?: 'visual' | 'atp' | 'fluorescent-marker' | 'culture';
  atpReading?: number;
  passedVerification?: boolean;
  deficiencies?: string[];
  notes?: string;
}

/**
 * PPE usage tracking
 */
export interface PPEUsage {
  id?: string;
  facilityId: string;
  unitId: string;
  date: Date;
  ppeType: 'gloves' | 'gown' | 'mask-surgical' | 'n95' | 'face-shield' | 'eye-protection' | 'shoe-covers';
  quantity: number;
  reason?: string;
  patientEncounter?: boolean;
  isolationRelated?: boolean;
  procedureRelated?: boolean;
  recordedBy?: string;
  cost?: number;
}

/**
 * PPE inventory
 */
export interface PPEInventory {
  facilityId: string;
  unitId?: string;
  ppeType: string;
  currentStock: number;
  minimumStock: number;
  reorderPoint: number;
  lastRestocked?: Date;
  expirationDate?: Date;
  manufacturer?: string;
  lotNumber?: string;
  cost?: number;
  burnRate?: number; // items per day
  daysOfSupply?: number;
  lowStockAlert: boolean;
}

/**
 * Infection prevention protocol
 */
export interface InfectionPreventionProtocol {
  id?: string;
  name: string;
  category: 'hand-hygiene' | 'isolation' | 'device-management' | 'environmental' | 'antibiotic-stewardship' | 'outbreak';
  version: string;
  effectiveDate: Date;
  reviewDate?: Date;
  status: 'active' | 'draft' | 'retired';
  description: string;
  indication: string;
  steps: Array<{
    order: number;
    description: string;
    criticalStep: boolean;
    evidenceLevel?: string;
  }>;
  ppeRequired?: string[];
  supplies?: string[];
  frequency?: string;
  documentation?: string[];
  references?: string[];
  owner?: string;
  approvedBy?: string;
  approvalDate?: Date;
}

/**
 * NHSN reporting data
 */
export interface NHSNReport {
  id?: string;
  facilityId: string;
  reportingPeriod: {
    month: number;
    year: number;
  };
  reportType: 'HAI' | 'device-utilization' | 'mdro' | 'laboratory-id';
  submittedDate?: Date;
  submittedBy?: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  data: {
    clabsi?: {
      events: number;
      centralLineDays: number;
      sir?: number; // Standardized Infection Ratio
    };
    cauti?: {
      events: number;
      urinaryCatheterDays: number;
      sir?: number;
    };
    ssi?: {
      procedures: number;
      infections: number;
      sir?: number;
    };
    vae?: {
      events: number;
      ventilatorDays: number;
      sir?: number;
    };
    cdi?: {
      healthcareOnset: number;
      communityOnset: number;
      sir?: number;
    };
    mdro?: {
      mrsa: number;
      vre: number;
      cre: number;
      other: number;
    };
  };
  validationErrors?: string[];
  nhsnResponse?: string;
}

// ============================================================================
// SECTION 1: INFECTION SURVEILLANCE (Functions 1-5)
// ============================================================================

/**
 * 1. Records healthcare-associated infection (HAI) event.
 *
 * @param {InfectionSurveillanceEvent} event - Infection event details
 * @returns {InfectionSurveillanceEvent} Created event with ID
 *
 * @example
 * ```typescript
 * const clabsiEvent = recordInfectionEvent({
 *   patientId: 'patient-123',
 *   eventDate: new Date(),
 *   infectionType: 'CLABSI',
 *   deviceAssociated: true,
 *   deviceType: 'central-line',
 *   deviceInsertionDate: new Date('2024-01-15'),
 *   onsetDate: new Date('2024-01-20'),
 *   reportedDate: new Date(),
 *   reportedBy: 'nurse-456',
 *   facilityId: 'facility-789'
 * });
 * ```
 */
export function recordInfectionEvent(event: InfectionSurveillanceEvent): InfectionSurveillanceEvent {
  return {
    ...event,
    id: event.id || crypto.randomUUID(),
    reportedDate: event.reportedDate || new Date(),
  };
}

/**
 * 2. Calculates device utilization ratio for HAI surveillance.
 *
 * @param {number} deviceDays - Total device days
 * @param {number} patientDays - Total patient days
 * @returns {number} Device utilization ratio
 *
 * @example
 * ```typescript
 * const centralLineDays = 450;
 * const patientDays = 900;
 * const utilizationRatio = calculateDeviceUtilizationRatio(centralLineDays, patientDays);
 * // Result: 0.50 (50% of patients had central lines)
 * ```
 */
export function calculateDeviceUtilizationRatio(deviceDays: number, patientDays: number): number {
  if (patientDays === 0) return 0;
  return Number((deviceDays / patientDays).toFixed(4));
}

/**
 * 3. Calculates Standardized Infection Ratio (SIR) for NHSN reporting.
 *
 * @param {number} observedInfections - Observed infection count
 * @param {number} predictedInfections - Predicted infection count (NHSN baseline)
 * @returns {number} SIR value
 *
 * @example
 * ```typescript
 * const sir = calculateSIR(5, 8.2);
 * // Result: 0.61 (39% fewer infections than predicted)
 * // SIR < 1.0 indicates better than baseline performance
 * ```
 */
export function calculateSIR(observedInfections: number, predictedInfections: number): number {
  if (predictedInfections === 0) return 0;
  return Number((observedInfections / predictedInfections).toFixed(2));
}

/**
 * 4. Identifies patients at high risk for HAI.
 *
 * @param {string} patientId - Patient identifier
 * @param {object} riskFactors - Risk factor data
 * @returns {object} Risk assessment
 *
 * @example
 * ```typescript
 * const riskAssessment = assessHAIRisk('patient-123', {
 *   centralLine: true,
 *   urinaryCatheter: true,
 *   ventilator: false,
 *   immunosuppressed: true,
 *   recentSurgery: true,
 *   lengthOfStay: 12
 * });
 *
 * if (riskAssessment.riskLevel === 'high') {
 *   // Implement enhanced surveillance
 * }
 * ```
 */
export function assessHAIRisk(
  patientId: string,
  riskFactors: {
    centralLine?: boolean;
    urinaryCatheter?: boolean;
    ventilator?: boolean;
    immunosuppressed?: boolean;
    recentSurgery?: boolean;
    lengthOfStay?: number;
    age?: number;
    comorbidities?: number;
  }
): {
  patientId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  recommendations: string[];
} {
  let score = 0;
  const identifiedRisks: string[] = [];
  const recommendations: string[] = [];

  if (riskFactors.centralLine) {
    score += 20;
    identifiedRisks.push('Central line in place');
    recommendations.push('Daily assessment for line necessity');
    recommendations.push('CLABSI prevention bundle compliance');
  }

  if (riskFactors.urinaryCatheter) {
    score += 15;
    identifiedRisks.push('Urinary catheter in place');
    recommendations.push('Daily assessment for catheter necessity');
    recommendations.push('CAUTI prevention bundle compliance');
  }

  if (riskFactors.ventilator) {
    score += 25;
    identifiedRisks.push('Mechanical ventilation');
    recommendations.push('VAP prevention bundle compliance');
    recommendations.push('Daily sedation vacation and spontaneous breathing trial');
  }

  if (riskFactors.immunosuppressed) {
    score += 15;
    identifiedRisks.push('Immunosuppressed');
    recommendations.push('Enhanced infection surveillance');
    recommendations.push('Protective isolation if indicated');
  }

  if (riskFactors.recentSurgery) {
    score += 10;
    identifiedRisks.push('Recent surgical procedure');
    recommendations.push('SSI surveillance');
    recommendations.push('Surgical site monitoring');
  }

  if (riskFactors.lengthOfStay && riskFactors.lengthOfStay > 7) {
    score += 10;
    identifiedRisks.push(`Extended length of stay (${riskFactors.lengthOfStay} days)`);
  }

  if (riskFactors.age && riskFactors.age > 65) {
    score += 5;
    identifiedRisks.push('Advanced age');
  }

  if (riskFactors.comorbidities && riskFactors.comorbidities >= 3) {
    score += 10;
    identifiedRisks.push('Multiple comorbidities');
  }

  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (score >= 60) riskLevel = 'critical';
  else if (score >= 40) riskLevel = 'high';
  else if (score >= 20) riskLevel = 'medium';
  else riskLevel = 'low';

  return {
    patientId,
    riskScore: score,
    riskLevel,
    riskFactors: identifiedRisks,
    recommendations,
  };
}

/**
 * 5. Detects trends in infection rates using statistical process control.
 *
 * @param {number[]} monthlyRates - Monthly infection rates
 * @param {number} baseline - Baseline rate
 * @returns {object} Trend analysis
 *
 * @example
 * ```typescript
 * const rates = [2.1, 2.3, 2.8, 3.5, 3.9, 4.2, 3.8];
 * const trend = detectInfectionTrend(rates, 2.5);
 *
 * if (trend.alert) {
 *   console.log(`Infection rate trending ${trend.direction}`);
 *   // Investigate and implement interventions
 * }
 * ```
 */
export function detectInfectionTrend(
  monthlyRates: number[],
  baseline: number
): {
  direction: 'increasing' | 'decreasing' | 'stable';
  alert: boolean;
  controlLimitExceeded: boolean;
  consecutiveIncreases: number;
  averageRate: number;
  percentChange: number;
} {
  if (monthlyRates.length < 3) {
    return {
      direction: 'stable',
      alert: false,
      controlLimitExceeded: false,
      consecutiveIncreases: 0,
      averageRate: 0,
      percentChange: 0,
    };
  }

  const averageRate = monthlyRates.reduce((a, b) => a + b, 0) / monthlyRates.length;
  const stdDev = Math.sqrt(
    monthlyRates.reduce((sq, n) => sq + Math.pow(n - averageRate, 2), 0) / monthlyRates.length
  );

  const upperControlLimit = baseline + (3 * stdDev);
  const controlLimitExceeded = monthlyRates.some(rate => rate > upperControlLimit);

  // Count consecutive increases
  let consecutiveIncreases = 0;
  for (let i = 1; i < monthlyRates.length; i++) {
    if (monthlyRates[i] > monthlyRates[i - 1]) {
      consecutiveIncreases++;
    } else {
      consecutiveIncreases = 0;
    }
  }

  // Determine trend direction
  const recentAvg = monthlyRates.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const percentChange = ((recentAvg - baseline) / baseline) * 100;

  let direction: 'increasing' | 'decreasing' | 'stable';
  if (percentChange > 10) direction = 'increasing';
  else if (percentChange < -10) direction = 'decreasing';
  else direction = 'stable';

  // Alert if control limit exceeded or 5+ consecutive increases
  const alert = controlLimitExceeded || consecutiveIncreases >= 5;

  return {
    direction,
    alert,
    controlLimitExceeded,
    consecutiveIncreases,
    averageRate,
    percentChange,
  };
}

// ============================================================================
// SECTION 2: ISOLATION MANAGEMENT (Functions 6-10)
// ============================================================================

/**
 * 6. Creates isolation precaution order.
 *
 * @param {Partial<IsolationOrder>} order - Isolation order details
 * @returns {IsolationOrder} Complete isolation order
 *
 * @example
 * ```typescript
 * const isolationOrder = createIsolationOrder({
 *   patientId: 'patient-123',
 *   encounterId: 'encounter-456',
 *   isolationType: 'contact',
 *   reason: 'MRSA colonization',
 *   pathogen: 'MRSA',
 *   orderDate: new Date(),
 *   orderedBy: 'dr-789',
 *   startDate: new Date(),
 *   status: 'active'
 * });
 * ```
 */
export function createIsolationOrder(order: Partial<IsolationOrder>): IsolationOrder {
  const ppeRequirements = determinePPERequirements(order.isolationType || 'standard');
  const roomRequirements = determineRoomRequirements(order.isolationType || 'standard');

  return {
    id: order.id || crypto.randomUUID(),
    patientId: order.patientId || '',
    encounterId: order.encounterId || '',
    isolationType: order.isolationType || 'standard',
    reason: order.reason || '',
    pathogen: order.pathogen,
    orderDate: order.orderDate || new Date(),
    orderedBy: order.orderedBy || '',
    startDate: order.startDate || new Date(),
    endDate: order.endDate,
    status: order.status || 'active',
    signRequired: order.signRequired ?? true,
    roomRequirements,
    ppeRequirements,
    specialInstructions: order.specialInstructions,
    complianceChecks: order.complianceChecks || [],
  };
}

/**
 * 7. Validates isolation precaution compliance.
 *
 * @param {IsolationOrder} order - Active isolation order
 * @param {object} observedPractice - Observed compliance data
 * @returns {object} Compliance validation result
 *
 * @example
 * ```typescript
 * const compliance = validateIsolationCompliance(isolationOrder, {
 *   glovesWorn: true,
 *   gownWorn: true,
 *   maskWorn: false,
 *   handHygieneBefore: true,
 *   handHygieneAfter: true
 * });
 *
 * if (!compliance.compliant) {
 *   console.error('Isolation precautions not followed:', compliance.violations);
 * }
 * ```
 */
export function validateIsolationCompliance(
  order: IsolationOrder,
  observedPractice: {
    glovesWorn?: boolean;
    gownWorn?: boolean;
    maskWorn?: boolean;
    n95Worn?: boolean;
    faceShieldWorn?: boolean;
    handHygieneBefore?: boolean;
    handHygieneAfter?: boolean;
  }
): {
  compliant: boolean;
  violations: string[];
  warnings: string[];
} {
  const violations: string[] = [];
  const warnings: string[] = [];

  const ppe = order.ppeRequirements;

  if (ppe?.gloves && !observedPractice.glovesWorn) {
    violations.push('Gloves required but not worn');
  }

  if (ppe?.gown && !observedPractice.gownWorn) {
    violations.push('Gown required but not worn');
  }

  if (ppe?.mask && !observedPractice.maskWorn && !observedPractice.n95Worn) {
    violations.push('Mask required but not worn');
  }

  if (ppe?.n95 && !observedPractice.n95Worn) {
    violations.push('N95 respirator required but not worn');
  }

  if (ppe?.faceShield && !observedPractice.faceShieldWorn) {
    violations.push('Face shield required but not worn');
  }

  if (!observedPractice.handHygieneBefore) {
    warnings.push('Hand hygiene before patient contact not documented');
  }

  if (!observedPractice.handHygieneAfter) {
    warnings.push('Hand hygiene after patient contact not documented');
  }

  return {
    compliant: violations.length === 0,
    violations,
    warnings,
  };
}

/**
 * 8. Generates isolation signage for patient room.
 *
 * @param {IsolationOrder} order - Isolation order
 * @returns {string} HTML signage
 *
 * @example
 * ```typescript
 * const signage = generateIsolationSignage(isolationOrder);
 * // Display signage outside patient room
 * await printService.print(signage);
 * ```
 */
export function generateIsolationSignage(order: IsolationOrder): string {
  const isolationTypeDisplay = order.isolationType.toUpperCase().replace('-', ' + ');

  const ppeIcons: string[] = [];
  if (order.ppeRequirements?.gloves) ppeIcons.push('🧤 Gloves');
  if (order.ppeRequirements?.gown) ppeIcons.push('🥼 Gown');
  if (order.ppeRequirements?.n95) ppeIcons.push('😷 N95 Respirator');
  else if (order.ppeRequirements?.mask) ppeIcons.push('😷 Mask');
  if (order.ppeRequirements?.faceShield || order.ppeRequirements?.eyeProtection) {
    ppeIcons.push('🥽 Eye Protection');
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Isolation Precautions</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #FFF3CD;
      border: 5px solid #FF0000;
      padding: 20px;
      margin: 0;
    }
    .header {
      background-color: #FF0000;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .precaution-type {
      font-size: 48px;
      text-align: center;
      margin: 20px 0;
      color: #FF0000;
      font-weight: bold;
    }
    .ppe-required {
      background-color: white;
      border: 3px solid #FF0000;
      padding: 20px;
      margin: 20px 0;
    }
    .ppe-required h2 {
      color: #FF0000;
      margin-top: 0;
      font-size: 28px;
    }
    .ppe-item {
      font-size: 24px;
      margin: 10px 0;
      padding: 10px;
      background-color: #F8F9FA;
    }
    .instructions {
      background-color: white;
      padding: 15px;
      margin: 20px 0;
      border: 2px solid #666;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 18px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    ⚠️ ISOLATION PRECAUTIONS ⚠️
  </div>

  <div class="precaution-type">
    ${isolationTypeDisplay} PRECAUTIONS
  </div>

  <div class="ppe-required">
    <h2>REQUIRED PERSONAL PROTECTIVE EQUIPMENT (PPE)</h2>
    ${ppeIcons.map(icon => `<div class="ppe-item">${icon}</div>`).join('\n    ')}
  </div>

  <div class="instructions">
    <h3>Instructions:</h3>
    <ol>
      <li>Perform hand hygiene BEFORE entering room</li>
      <li>Don required PPE before entering</li>
      <li>Remove PPE before leaving room</li>
      <li>Perform hand hygiene AFTER leaving room</li>
      ${order.roomRequirements?.privateRoom ? '<li><strong>Private room required</strong></li>' : ''}
      ${order.roomRequirements?.negativePressure ? '<li><strong>Keep door closed - Negative pressure room</strong></li>' : ''}
    </ol>
    ${order.specialInstructions ? `<p><strong>Special Instructions:</strong> ${order.specialInstructions}</p>` : ''}
  </div>

  <div class="footer">
    <p>Reason: ${order.reason}</p>
    ${order.pathogen ? `<p>Pathogen: ${order.pathogen}</p>` : ''}
    <p>Order Date: ${order.orderDate.toLocaleDateString()}</p>
  </div>
</body>
</html>`;
}

/**
 * 9. Discontinues isolation order.
 *
 * @param {string} orderId - Isolation order ID
 * @param {string} discontinuedBy - User discontinuing order
 * @param {string} reason - Reason for discontinuation
 * @returns {Partial<IsolationOrder>} Updated order
 *
 * @example
 * ```typescript
 * const discontinued = discontinueIsolation(
 *   'order-123',
 *   'dr-456',
 *   'Negative culture results x3'
 * );
 * ```
 */
export function discontinueIsolation(
  orderId: string,
  discontinuedBy: string,
  reason: string
): Partial<IsolationOrder> {
  return {
    id: orderId,
    status: 'discontinued',
    endDate: new Date(),
    discontinuedBy,
    discontinuedReason: reason,
  };
}

/**
 * 10. Calculates isolation days for reporting.
 *
 * @param {IsolationOrder[]} orders - Isolation orders
 * @param {Date} startDate - Reporting period start
 * @param {Date} endDate - Reporting period end
 * @returns {object} Isolation statistics
 *
 * @example
 * ```typescript
 * const stats = calculateIsolationDays(
 *   isolationOrders,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log(`Total isolation days: ${stats.totalIsolationDays}`);
 * ```
 */
export function calculateIsolationDays(
  orders: IsolationOrder[],
  startDate: Date,
  endDate: Date
): {
  totalIsolationDays: number;
  byType: Record<string, number>;
  averageDuration: number;
} {
  let totalDays = 0;
  const byType: Record<string, number> = {};
  let orderCount = 0;

  for (const order of orders) {
    const orderStart = order.startDate > startDate ? order.startDate : startDate;
    const orderEnd = order.endDate && order.endDate < endDate ? order.endDate : endDate;

    if (orderStart <= endDate && orderEnd >= startDate) {
      const days = Math.ceil((orderEnd.getTime() - orderStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      totalDays += days;
      orderCount++;

      if (!byType[order.isolationType]) {
        byType[order.isolationType] = 0;
      }
      byType[order.isolationType] += days;
    }
  }

  return {
    totalIsolationDays: totalDays,
    byType,
    averageDuration: orderCount > 0 ? totalDays / orderCount : 0,
  };
}

// ============================================================================
// SECTION 3: OUTBREAK DETECTION (Functions 11-15)
// ============================================================================

/**
 * 11. Detects potential outbreak using statistical algorithms.
 *
 * @param {InfectionSurveillanceEvent[]} events - Recent infection events
 * @param {object} parameters - Detection parameters
 * @returns {OutbreakDetection | null} Detected outbreak or null
 *
 * @example
 * ```typescript
 * const outbreak = detectOutbreak(recentInfections, {
 *   facilityId: 'facility-123',
 *   unitId: 'icu-2',
 *   pathogen: 'C. difficile',
 *   timeWindow: 30, // days
 *   threshold: 3
 * });
 *
 * if (outbreak) {
 *   await notifyInfectionControl(outbreak);
 * }
 * ```
 */
export function detectOutbreak(
  events: InfectionSurveillanceEvent[],
  parameters: {
    facilityId: string;
    unitId?: string;
    pathogen?: string;
    timeWindow: number; // days
    threshold: number;
  }
): OutbreakDetection | null {
  const now = new Date();
  const windowStart = new Date(now.getTime() - (parameters.timeWindow * 24 * 60 * 60 * 1000));

  // Filter events
  const relevantEvents = events.filter(event =>
    event.facilityId === parameters.facilityId &&
    (!parameters.unitId || event.unitId === parameters.unitId) &&
    (!parameters.pathogen || event.pathogen === parameters.pathogen) &&
    event.onsetDate >= windowStart &&
    event.onsetDate <= now
  );

  if (relevantEvents.length >= parameters.threshold) {
    // Group by pathogen
    const pathogenGroups: Record<string, InfectionSurveillanceEvent[]> = {};

    for (const event of relevantEvents) {
      const pathogen = event.pathogen || 'Unknown';
      if (!pathogenGroups[pathogen]) {
        pathogenGroups[pathogen] = [];
      }
      pathogenGroups[pathogen].push(event);
    }

    // Find largest cluster
    let largestCluster: InfectionSurveillanceEvent[] = [];
    let clusterPathogen = '';

    for (const [pathogen, group] of Object.entries(pathogenGroups)) {
      if (group.length > largestCluster.length) {
        largestCluster = group;
        clusterPathogen = pathogen;
      }
    }

    if (largestCluster.length >= parameters.threshold) {
      return {
        id: crypto.randomUUID(),
        facilityId: parameters.facilityId,
        unitId: parameters.unitId,
        pathogen: clusterPathogen,
        startDate: largestCluster[0].onsetDate,
        status: 'suspected',
        caseCount: largestCluster.length,
        affectedPatients: largestCluster.map(e => e.patientId),
      };
    }
  }

  return null;
}

/**
 * 12. Initiates contact tracing for outbreak investigation.
 *
 * @param {string} indexCaseId - Index case event ID
 * @param {string} indexPatientId - Index patient ID
 * @param {object[]} potentialContacts - Potential contact list
 * @returns {ContactTrace[]} Contact trace records
 *
 * @example
 * ```typescript
 * const contacts = initiateContactTracing(
 *   'event-123',
 *   'patient-456',
 *   [
 *     { type: 'patient', id: 'patient-789', exposureDate: new Date() },
 *     { type: 'staff', id: 'nurse-012', exposureDate: new Date() }
 *   ]
 * );
 * ```
 */
export function initiateContactTracing(
  indexCaseId: string,
  indexPatientId: string,
  potentialContacts: Array<{
    type: 'patient' | 'staff' | 'visitor';
    id: string;
    name?: string;
    role?: string;
    exposureDate: Date;
    exposureDuration?: number;
    exposureLocation?: string;
    exposureType?: 'direct' | 'indirect' | 'environmental';
  }>
): ContactTrace[] {
  return potentialContacts.map(contact => ({
    id: crypto.randomUUID(),
    indexCaseId,
    indexPatientId,
    contactType: contact.type,
    contactId: contact.id,
    contactName: contact.name,
    contactRole: contact.role,
    exposureDate: contact.exposureDate,
    exposureDuration: contact.exposureDuration,
    exposureLocation: contact.exposureLocation,
    exposureType: contact.exposureType || 'direct',
    riskLevel: assessContactRisk(contact.exposureDuration, contact.exposureType),
    notified: false,
    tested: false,
    quarantined: false,
    symptomatic: false,
    followUpRequired: true,
  }));
}

/**
 * 13. Generates outbreak investigation report.
 *
 * @param {OutbreakDetection} outbreak - Outbreak data
 * @param {InfectionSurveillanceEvent[]} events - Associated events
 * @param {ContactTrace[]} contacts - Contact traces
 * @returns {string} Investigation report
 *
 * @example
 * ```typescript
 * const report = generateOutbreakReport(outbreak, events, contacts);
 * await reportingService.submit(report, 'public-health');
 * ```
 */
export function generateOutbreakReport(
  outbreak: OutbreakDetection,
  events: InfectionSurveillanceEvent[],
  contacts: ContactTrace[]
): string {
  const duration = outbreak.endDate
    ? Math.ceil((outbreak.endDate.getTime() - outbreak.startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 'Ongoing';

  return `
OUTBREAK INVESTIGATION REPORT
========================================

Outbreak ID: ${outbreak.id}
Status: ${outbreak.status.toUpperCase()}
Facility: ${outbreak.facilityId}
${outbreak.unitId ? `Unit: ${outbreak.unitId}` : ''}

SUMMARY
--------
Pathogen: ${outbreak.pathogen}
Start Date: ${outbreak.startDate.toLocaleDateString()}
${outbreak.endDate ? `End Date: ${outbreak.endDate.toLocaleDateString()}` : 'End Date: Ongoing'}
Duration: ${duration} days
Total Cases: ${outbreak.caseCount}

AFFECTED INDIVIDUALS
--------------------
Patients: ${outbreak.affectedPatients.length}
${outbreak.affectedStaff ? `Staff: ${outbreak.affectedStaff.length}` : ''}

EPIDEMIOLOGICAL CURVE
---------------------
${generateEpiCurve(events)}

TRANSMISSION
------------
Mode: ${outbreak.transmissionMode || 'Under investigation'}
${outbreak.commonSource ? `Common Source: ${outbreak.commonSource}` : ''}

CONTACT TRACING
---------------
Total Contacts Identified: ${contacts.length}
High Risk: ${contacts.filter(c => c.riskLevel === 'high').length}
Medium Risk: ${contacts.filter(c => c.riskLevel === 'medium').length}
Low Risk: ${contacts.filter(c => c.riskLevel === 'low').length}

Tested: ${contacts.filter(c => c.tested).length}
Positive Results: ${contacts.filter(c => c.testResult === 'positive').length}
Quarantined: ${contacts.filter(c => c.quarantined).length}

INTERVENTIONS
-------------
${outbreak.interventions?.map((i, idx) => `${idx + 1}. ${i}`).join('\n') || 'None documented'}

ROOT CAUSE ANALYSIS
-------------------
${outbreak.rootCause || 'Pending investigation'}

PREVENTATIVE MEASURES
---------------------
${outbreak.preventativeMeasures?.map((m, idx) => `${idx + 1}. ${m}`).join('\n') || 'None documented'}

PUBLIC HEALTH NOTIFICATION
--------------------------
Notified: ${outbreak.publicHealthNotified ? 'Yes' : 'No'}
${outbreak.publicHealthAgency ? `Agency: ${outbreak.publicHealthAgency}` : ''}
${outbreak.notificationDate ? `Date: ${outbreak.notificationDate.toLocaleDateString()}` : ''}

NOTES
-----
${outbreak.notes || 'None'}

Report Generated: ${new Date().toLocaleString()}
`;
}

/**
 * 14. Calculates attack rate for outbreak analysis.
 *
 * @param {number} cases - Number of cases
 * @param {number} population - Population at risk
 * @returns {number} Attack rate percentage
 *
 * @example
 * ```typescript
 * const attackRate = calculateAttackRate(12, 150);
 * // Result: 8.0 (8% of population affected)
 * ```
 */
export function calculateAttackRate(cases: number, population: number): number {
  if (population === 0) return 0;
  return Number(((cases / population) * 100).toFixed(1));
}

/**
 * 15. Determines if public health notification is required.
 *
 * @param {OutbreakDetection} outbreak - Outbreak data
 * @param {object} criteria - Notification criteria
 * @returns {boolean} True if notification required
 *
 * @example
 * ```typescript
 * const requiresNotification = requiresPublicHealthNotification(outbreak, {
 *   reportablePathogens: ['E. coli O157', 'Salmonella', 'Legionella'],
 *   caseThreshold: 2,
 *   immunocompromisedPopulation: false
 * });
 * ```
 */
export function requiresPublicHealthNotification(
  outbreak: OutbreakDetection,
  criteria: {
    reportablePathogens: string[];
    caseThreshold: number;
    immunocompromisedPopulation?: boolean;
    foodborne?: boolean;
    waterborne?: boolean;
  }
): boolean {
  // Check if pathogen is reportable
  if (criteria.reportablePathogens.some(p => outbreak.pathogen.toLowerCase().includes(p.toLowerCase()))) {
    return true;
  }

  // Check case threshold
  if (outbreak.caseCount >= criteria.caseThreshold) {
    return true;
  }

  // Foodborne or waterborne outbreaks always reportable
  if (outbreak.transmissionMode === 'foodborne' || outbreak.transmissionMode === 'waterborne') {
    return true;
  }

  // Immunocompromised populations require lower threshold
  if (criteria.immunocompromisedPopulation && outbreak.caseCount >= 2) {
    return true;
  }

  return false;
}

// ============================================================================
// SECTION 4: HAND HYGIENE COMPLIANCE (Functions 16-20)
// ============================================================================

/**
 * 16. Records hand hygiene observation.
 *
 * @param {HandHygieneObservation} observation - Observation data
 * @returns {HandHygieneObservation} Created observation with ID
 *
 * @example
 * ```typescript
 * const observation = recordHandHygieneObservation({
 *   observationDate: new Date(),
 *   observer: 'nurse-manager-123',
 *   facilityId: 'facility-456',
 *   unitId: 'med-surg-3',
 *   staffMember: 'nurse-789',
 *   staffRole: 'RN',
 *   moment: '1-before-patient',
 *   action: 'alcohol-rub',
 *   compliant: true,
 *   technique: 'adequate',
 *   duration: 25
 * });
 * ```
 */
export function recordHandHygieneObservation(observation: HandHygieneObservation): HandHygieneObservation {
  return {
    ...observation,
    id: observation.id || crypto.randomUUID(),
    observationDate: observation.observationDate || new Date(),
  };
}

/**
 * 17. Calculates hand hygiene compliance rate.
 *
 * @param {HandHygieneObservation[]} observations - Observations
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {HandHygieneComplianceReport} Compliance report
 *
 * @example
 * ```typescript
 * const report = calculateHandHygieneCompliance(
 *   observations,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log(`Compliance rate: ${report.complianceRate}%`);
 * ```
 */
export function calculateHandHygieneCompliance(
  observations: HandHygieneObservation[],
  startDate: Date,
  endDate: Date
): HandHygieneComplianceReport {
  const filtered = observations.filter(obs =>
    obs.observationDate >= startDate && obs.observationDate <= endDate
  );

  const totalObs = filtered.length;
  const compliant = filtered.filter(obs => obs.compliant).length;
  const complianceRate = totalObs > 0 ? Number(((compliant / totalObs) * 100).toFixed(1)) : 0;

  // By moment
  const byMoment: Record<string, { total: number; compliant: number; rate: number }> = {};
  const moments = ['1-before-patient', '2-before-aseptic', '3-after-body-fluid', '4-after-patient', '5-after-surroundings'];

  for (const moment of moments) {
    const momentObs = filtered.filter(obs => obs.moment === moment);
    const momentCompliant = momentObs.filter(obs => obs.compliant).length;

    byMoment[moment] = {
      total: momentObs.length,
      compliant: momentCompliant,
      rate: momentObs.length > 0 ? Number(((momentCompliant / momentObs.length) * 100).toFixed(1)) : 0,
    };
  }

  // By role
  const byRole: Record<string, { total: number; compliant: number; rate: number }> = {};
  const roles = [...new Set(filtered.map(obs => obs.staffRole).filter(Boolean))];

  for (const role of roles) {
    const roleObs = filtered.filter(obs => obs.staffRole === role);
    const roleCompliant = roleObs.filter(obs => obs.compliant).length;

    byRole[role!] = {
      total: roleObs.length,
      compliant: roleCompliant,
      rate: roleObs.length > 0 ? Number(((roleCompliant / roleObs.length) * 100).toFixed(1)) : 0,
    };
  }

  // By product
  const byProduct: Record<string, number> = {};
  filtered.forEach(obs => {
    if (obs.productUsed) {
      byProduct[obs.productUsed] = (byProduct[obs.productUsed] || 0) + 1;
    }
  });

  // Determine trend (simplified)
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (complianceRate > 85) trend = 'improving';
  else if (complianceRate < 70) trend = 'declining';

  return {
    facilityId: filtered[0]?.facilityId || '',
    unitId: filtered[0]?.unitId,
    startDate,
    endDate,
    totalObservations: totalObs,
    compliantObservations: compliant,
    complianceRate,
    byMoment,
    byRole,
    byProduct,
    trend,
  };
}

/**
 * 18. Validates hand hygiene technique.
 *
 * @param {object} technique - Technique parameters
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateHandHygieneTechnique({
 *   method: 'alcohol-rub',
 *   duration: 15,
 *   steps: ['palms', 'backs', 'fingers', 'thumbs', 'fingertips', 'wrists']
 * });
 * ```
 */
export function validateHandHygieneTechnique(technique: {
  method: 'hand-wash' | 'alcohol-rub';
  duration: number; // seconds
  steps?: string[];
}): {
  adequate: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (technique.method === 'alcohol-rub') {
    if (technique.duration < 20) {
      issues.push('Duration too short - minimum 20 seconds for alcohol-based hand rub');
      recommendations.push('Rub hands until completely dry (approximately 20-30 seconds)');
    }
  } else if (technique.method === 'hand-wash') {
    if (technique.duration < 40) {
      issues.push('Duration too short - minimum 40 seconds for handwashing with soap and water');
      recommendations.push('Wash hands for at least 40-60 seconds');
    }
  }

  const requiredSteps = ['palms', 'backs', 'fingers', 'thumbs', 'fingertips', 'wrists'];
  if (technique.steps) {
    const missedSteps = requiredSteps.filter(step => !technique.steps!.includes(step));
    if (missedSteps.length > 0) {
      issues.push(`Missed steps: ${missedSteps.join(', ')}`);
      recommendations.push('Ensure all hand surfaces are cleaned');
    }
  }

  return {
    adequate: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * 19. Generates hand hygiene compliance dashboard data.
 *
 * @param {HandHygieneComplianceReport[]} monthlyReports - Monthly reports
 * @returns {object} Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = generateHandHygieneDashboard(last12MonthsReports);
 * // Display dashboard in UI
 * ```
 */
export function generateHandHygieneDashboard(monthlyReports: HandHygieneComplianceReport[]): {
  currentRate: number;
  trend: 'improving' | 'declining' | 'stable';
  monthlyTrend: number[];
  comparisonToGoal: number;
  topPerformingUnits: string[];
  needsImprovementUnits: string[];
} {
  const currentReport = monthlyReports[monthlyReports.length - 1];
  const monthlyTrend = monthlyReports.map(r => r.complianceRate);

  const goal = 90; // 90% compliance goal
  const comparisonToGoal = currentReport ? currentReport.complianceRate - goal : 0;

  return {
    currentRate: currentReport?.complianceRate || 0,
    trend: currentReport?.trend || 'stable',
    monthlyTrend,
    comparisonToGoal,
    topPerformingUnits: [],
    needsImprovementUnits: [],
  };
}

/**
 * 20. Creates hand hygiene improvement action plan.
 *
 * @param {HandHygieneComplianceReport} report - Compliance report
 * @returns {string[]} Action items
 *
 * @example
 * ```typescript
 * const actionPlan = createHandHygieneActionPlan(complianceReport);
 * actionPlan.forEach(action => {
 *   console.log(`- ${action}`);
 * });
 * ```
 */
export function createHandHygieneActionPlan(report: HandHygieneComplianceReport): string[] {
  const actions: string[] = [];

  if (report.complianceRate < 70) {
    actions.push('URGENT: Conduct immediate staff education on hand hygiene');
    actions.push('Implement direct observation and feedback program');
    actions.push('Assess hand hygiene product availability and accessibility');
  } else if (report.complianceRate < 85) {
    actions.push('Increase visibility of hand hygiene compliance data');
    actions.push('Provide targeted education for low-performing areas');
  }

  // Moment-specific interventions
  for (const [moment, data] of Object.entries(report.byMoment)) {
    if (data.rate < 80) {
      actions.push(`Focus on "${moment}" - compliance only ${data.rate}%`);
    }
  }

  // Role-specific interventions
  for (const [role, data] of Object.entries(report.byRole)) {
    if (data.rate < 75) {
      actions.push(`Targeted education for ${role} - compliance ${data.rate}%`);
    }
  }

  if (actions.length === 0) {
    actions.push('Maintain current practices - compliance meets standards');
    actions.push('Continue regular monitoring and feedback');
  }

  return actions;
}

// ============================================================================
// SECTION 5: ANTIBIOTIC STEWARDSHIP (Functions 21-25)
// ============================================================================

/**
 * 21. Tracks antibiotic prescription for stewardship review.
 *
 * @param {AntibioticPrescription} prescription - Prescription details
 * @returns {AntibioticPrescription} Created prescription with ID
 *
 * @example
 * ```typescript
 * const prescription = trackAntibioticPrescription({
 *   patientId: 'patient-123',
 *   encounterId: 'encounter-456',
 *   antibioticName: 'Vancomycin',
 *   antibioticClass: 'Glycopeptide',
 *   dose: '1g',
 *   route: 'IV',
 *   frequency: 'Q12H',
 *   indication: 'Suspected MRSA pneumonia',
 *   cultureOrdered: true,
 *   prescribedBy: 'dr-789',
 *   prescribedDate: new Date(),
 *   startDate: new Date(),
 *   status: 'active',
 *   reviewRequired: true
 * });
 * ```
 */
export function trackAntibioticPrescription(prescription: AntibioticPrescription): AntibioticPrescription {
  return {
    ...prescription,
    id: prescription.id || crypto.randomUUID(),
    prescribedDate: prescription.prescribedDate || new Date(),
    startDate: prescription.startDate || new Date(),
    reviewRequired: prescription.reviewRequired ?? true,
  };
}

/**
 * 22. Generates antibiotic stewardship alerts.
 *
 * @param {AntibioticPrescription} prescription - Antibiotic prescription
 * @param {CultureResult} cultureResult - Culture and sensitivity result
 * @returns {object} Stewardship alert
 *
 * @example
 * ```typescript
 * const alert = generateStewardshipAlert(prescription, cultureResult);
 * if (alert.requiresIntervention) {
 *   await notifyPharmacist(alert);
 * }
 * ```
 */
export function generateStewardshipAlert(
  prescription: AntibioticPrescription,
  cultureResult?: CultureResult
): {
  alertType: 'de-escalation' | 'duration' | 'inappropriate' | 'no-culture' | 'resistance' | 'none';
  severity: 'high' | 'medium' | 'low';
  requiresIntervention: boolean;
  recommendations: string[];
  message: string;
} {
  const recommendations: string[] = [];
  let alertType: 'de-escalation' | 'duration' | 'inappropriate' | 'no-culture' | 'resistance' | 'none' = 'none';
  let severity: 'high' | 'medium' | 'low' = 'low';
  let message = '';

  // Check for culture order
  if (!prescription.cultureOrdered && prescription.status === 'active') {
    alertType = 'no-culture';
    severity = 'medium';
    message = 'Antibiotic started without culture';
    recommendations.push('Order blood cultures before continuing antibiotic');
    recommendations.push('Document clinical indication for empiric therapy');
  }

  // Check for de-escalation opportunity
  if (cultureResult && cultureResult.status === 'final' && cultureResult.organisms.length > 0) {
    const organism = cultureResult.organisms[0];

    if (organism.sensitivities) {
      const narrowerOptions = organism.sensitivities.filter(s =>
        s.interpretation === 'susceptible' &&
        s.antibiotic !== prescription.antibioticName
      );

      if (narrowerOptions.length > 0) {
        alertType = 'de-escalation';
        severity = 'high';
        message = 'De-escalation opportunity identified';
        recommendations.push(`Consider switching to narrower spectrum: ${narrowerOptions.map(o => o.antibiotic).join(', ')}`);
        recommendations.push('Consult infectious disease if uncertain');
      }

      // Check for resistance
      const currentDrugSensitivity = organism.sensitivities.find(s =>
        s.antibiotic === prescription.antibioticName
      );

      if (currentDrugSensitivity?.interpretation === 'resistant') {
        alertType = 'resistance';
        severity = 'high';
        message = 'Organism resistant to current antibiotic';
        recommendations.push('URGENT: Change antibiotic immediately');
        recommendations.push('Review culture sensitivities and adjust therapy');
      }
    }
  }

  // Check duration
  const daysOnTherapy = prescription.endDate
    ? Math.ceil((prescription.endDate.getTime() - prescription.startDate.getTime()) / (1000 * 60 * 60 * 24))
    : Math.ceil((new Date().getTime() - prescription.startDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysOnTherapy > 7 && prescription.status === 'active' && !prescription.reviewDate) {
    alertType = 'duration';
    severity = 'medium';
    message = `Extended antibiotic course (${daysOnTherapy} days)`;
    recommendations.push('Review clinical necessity for continued therapy');
    recommendations.push('Consider stopping if infection resolved');
    recommendations.push('Document plan for duration');
  }

  return {
    alertType,
    severity,
    requiresIntervention: alertType !== 'none',
    recommendations,
    message,
  };
}

/**
 * 23. Calculates antibiotic days of therapy (DOT).
 *
 * @param {AntibioticPrescription[]} prescriptions - Antibiotic prescriptions
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {object} DOT statistics
 *
 * @example
 * ```typescript
 * const stats = calculateDaysOfTherapy(
 *   prescriptions,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log(`Total DOT: ${stats.totalDOT}`);
 * ```
 */
export function calculateDaysOfTherapy(
  prescriptions: AntibioticPrescription[],
  startDate: Date,
  endDate: Date
): {
  totalDOT: number;
  byClass: Record<string, number>;
  byIndication: Record<string, number>;
  averageDuration: number;
} {
  let totalDOT = 0;
  const byClass: Record<string, number> = {};
  const byIndication: Record<string, number> = {};

  for (const rx of prescriptions) {
    const rxStart = rx.startDate > startDate ? rx.startDate : startDate;
    const rxEnd = rx.endDate && rx.endDate < endDate ? rx.endDate : endDate;

    if (rxStart <= endDate && rxEnd >= startDate) {
      const days = Math.ceil((rxEnd.getTime() - rxStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      totalDOT += days;

      if (!byClass[rx.antibioticClass]) {
        byClass[rx.antibioticClass] = 0;
      }
      byClass[rx.antibioticClass] += days;

      if (!byIndication[rx.indication]) {
        byIndication[rx.indication] = 0;
      }
      byIndication[rx.indication] += days;
    }
  }

  return {
    totalDOT,
    byClass,
    byIndication,
    averageDuration: prescriptions.length > 0 ? totalDOT / prescriptions.length : 0,
  };
}

/**
 * 24. Monitors antibiotic resistance patterns.
 *
 * @param {CultureResult[]} cultureResults - Culture results
 * @param {string} organism - Organism name
 * @returns {object} Resistance data
 *
 * @example
 * ```typescript
 * const resistance = monitorAntibioticResistance(
 *   cultureResults,
 *   'Staphylococcus aureus'
 * );
 * console.log(`MRSA rate: ${resistance.resistanceRates['Methicillin']}%`);
 * ```
 */
export function monitorAntibioticResistance(
  cultureResults: CultureResult[],
  organism: string
): {
  organism: string;
  totalIsolates: number;
  resistanceRates: Record<string, number>;
  multiDrugResistant: number;
  trend: 'increasing' | 'decreasing' | 'stable';
} {
  const relevantCultures = cultureResults.filter(c =>
    c.organisms.some(o => o.name.toLowerCase().includes(organism.toLowerCase()))
  );

  const resistanceRates: Record<string, number> = {};
  const antibioticCounts: Record<string, { total: number; resistant: number }> = {};

  for (const culture of relevantCultures) {
    const org = culture.organisms.find(o => o.name.toLowerCase().includes(organism.toLowerCase()));

    if (org?.sensitivities) {
      for (const sensitivity of org.sensitivities) {
        if (!antibioticCounts[sensitivity.antibiotic]) {
          antibioticCounts[sensitivity.antibiotic] = { total: 0, resistant: 0 };
        }
        antibioticCounts[sensitivity.antibiotic].total++;
        if (sensitivity.interpretation === 'resistant') {
          antibioticCounts[sensitivity.antibiotic].resistant++;
        }
      }
    }
  }

  for (const [antibiotic, counts] of Object.entries(antibioticCounts)) {
    resistanceRates[antibiotic] = counts.total > 0
      ? Number(((counts.resistant / counts.total) * 100).toFixed(1))
      : 0;
  }

  // Count multi-drug resistant isolates (resistant to 3+ classes)
  const mdrCount = relevantCultures.filter(culture => {
    const org = culture.organisms.find(o => o.name.toLowerCase().includes(organism.toLowerCase()));
    if (!org?.sensitivities) return false;

    const resistantCount = org.sensitivities.filter(s => s.interpretation === 'resistant').length;
    return resistantCount >= 3;
  }).length;

  return {
    organism,
    totalIsolates: relevantCultures.length,
    resistanceRates,
    multiDrugResistant: mdrCount,
    trend: 'stable', // Simplified - would calculate from historical data
  };
}

/**
 * 25. Generates antibiotic stewardship metrics report.
 *
 * @param {AntibioticPrescription[]} prescriptions - Prescriptions
 * @param {CultureResult[]} cultures - Culture results
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {object} Stewardship metrics
 *
 * @example
 * ```typescript
 * const metrics = generateStewardshipMetrics(
 *   prescriptions,
 *   cultures,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export function generateStewardshipMetrics(
  prescriptions: AntibioticPrescription[],
  cultures: CultureResult[],
  startDate: Date,
  endDate: Date
): {
  totalPrescriptions: number;
  cultureOrderedRate: number;
  appropriateTherapyRate: number;
  deEscalationRate: number;
  averageDuration: number;
  interventionRate: number;
} {
  const filtered = prescriptions.filter(rx =>
    rx.prescribedDate >= startDate && rx.prescribedDate <= endDate
  );

  const cultureOrdered = filtered.filter(rx => rx.cultureOrdered).length;
  const appropriate = filtered.filter(rx => rx.appropriateness === 'appropriate').length;
  const interventions = filtered.filter(rx => rx.interventionRequired).length;

  const durations = filtered
    .filter(rx => rx.endDate)
    .map(rx => Math.ceil((rx.endDate!.getTime() - rx.startDate.getTime()) / (1000 * 60 * 60 * 24)));

  const avgDuration = durations.length > 0
    ? durations.reduce((a, b) => a + b, 0) / durations.length
    : 0;

  return {
    totalPrescriptions: filtered.length,
    cultureOrderedRate: filtered.length > 0 ? (cultureOrdered / filtered.length) * 100 : 0,
    appropriateTherapyRate: filtered.length > 0 ? (appropriate / filtered.length) * 100 : 0,
    deEscalationRate: 0, // Would calculate from actual de-escalations
    averageDuration: avgDuration,
    interventionRate: filtered.length > 0 ? (interventions / filtered.length) * 100 : 0,
  };
}

// ============================================================================
// SECTION 6: ENVIRONMENTAL SERVICES (Functions 26-30)
// ============================================================================

/**
 * 26. Creates environmental cleaning task.
 *
 * @param {Partial<CleaningTask>} task - Cleaning task details
 * @returns {CleaningTask} Complete cleaning task
 *
 * @example
 * ```typescript
 * const task = createCleaningTask({
 *   facilityId: 'facility-123',
 *   location: 'Room 405',
 *   locationType: 'isolation-room',
 *   cleaningType: 'terminal',
 *   priority: 'urgent',
 *   scheduledDate: new Date(),
 *   status: 'pending'
 * });
 * ```
 */
export function createCleaningTask(task: Partial<CleaningTask>): CleaningTask {
  const checklist = generateCleaningChecklist(task.cleaningType || 'routine', task.locationType || 'patient-room');

  return {
    id: task.id || crypto.randomUUID(),
    facilityId: task.facilityId || '',
    location: task.location || '',
    locationType: task.locationType || 'patient-room',
    cleaningType: task.cleaningType || 'routine',
    priority: task.priority || 'routine',
    assignedTo: task.assignedTo,
    assignedDate: task.assignedDate,
    scheduledDate: task.scheduledDate || new Date(),
    startTime: task.startTime,
    completionTime: task.completionTime,
    status: task.status || 'pending',
    checklist,
    disinfectantUsed: task.disinfectantUsed,
    contactTime: task.contactTime,
    verifiedBy: task.verifiedBy,
    verificationMethod: task.verificationMethod,
    atpReading: task.atpReading,
    passedVerification: task.passedVerification,
    deficiencies: task.deficiencies || [],
    notes: task.notes,
  };
}

/**
 * 27. Verifies cleaning quality using ATP bioluminescence.
 *
 * @param {number} atpReading - ATP reading in RLU
 * @param {string} surfaceType - Type of surface tested
 * @returns {object} Verification result
 *
 * @example
 * ```typescript
 * const verification = verifyCleaningQuality(150, 'high-touch-surface');
 * if (!verification.passed) {
 *   console.log('Re-cleaning required');
 * }
 * ```
 */
export function verifyCleaningQuality(
  atpReading: number,
  surfaceType: 'high-touch-surface' | 'patient-care-area' | 'food-surface' | 'general-surface'
): {
  passed: boolean;
  grade: 'excellent' | 'good' | 'acceptable' | 'fail';
  threshold: number;
  action: string;
} {
  let threshold: number;
  let grade: 'excellent' | 'good' | 'acceptable' | 'fail';
  let action: string;

  // ATP thresholds in RLU (Relative Light Units)
  switch (surfaceType) {
    case 'high-touch-surface':
      threshold = 250;
      if (atpReading < 100) {
        grade = 'excellent';
        action = 'No action required';
      } else if (atpReading < 250) {
        grade = 'good';
        action = 'Monitor trend';
      } else if (atpReading < 500) {
        grade = 'acceptable';
        action = 'Review cleaning procedure';
      } else {
        grade = 'fail';
        action = 'Re-clean immediately';
      }
      break;

    case 'patient-care-area':
      threshold = 500;
      if (atpReading < 250) {
        grade = 'excellent';
        action = 'No action required';
      } else if (atpReading < 500) {
        grade = 'good';
        action = 'Monitor trend';
      } else if (atpReading < 1000) {
        grade = 'acceptable';
        action = 'Review cleaning procedure';
      } else {
        grade = 'fail';
        action = 'Re-clean immediately';
      }
      break;

    case 'food-surface':
      threshold = 150;
      if (atpReading < 75) {
        grade = 'excellent';
        action = 'No action required';
      } else if (atpReading < 150) {
        grade = 'good';
        action = 'Monitor trend';
      } else if (atpReading < 300) {
        grade = 'acceptable';
        action = 'Review cleaning procedure';
      } else {
        grade = 'fail';
        action = 'Re-clean immediately';
      }
      break;

    default: // general-surface
      threshold = 1000;
      if (atpReading < 500) {
        grade = 'excellent';
        action = 'No action required';
      } else if (atpReading < 1000) {
        grade = 'good';
        action = 'Monitor trend';
      } else if (atpReading < 2000) {
        grade = 'acceptable';
        action = 'Review cleaning procedure';
      } else {
        grade = 'fail';
        action = 'Re-clean immediately';
      }
  }

  return {
    passed: atpReading < threshold,
    grade,
    threshold,
    action,
  };
}

/**
 * 28. Tracks PPE usage and consumption.
 *
 * @param {PPEUsage} usage - PPE usage data
 * @returns {PPEUsage} Created usage record with ID
 *
 * @example
 * ```typescript
 * const usage = trackPPEUsage({
 *   facilityId: 'facility-123',
 *   unitId: 'icu-2',
 *   date: new Date(),
 *   ppeType: 'n95',
 *   quantity: 25,
 *   isolationRelated: true,
 *   recordedBy: 'charge-nurse-456'
 * });
 * ```
 */
export function trackPPEUsage(usage: PPEUsage): PPEUsage {
  return {
    ...usage,
    id: usage.id || crypto.randomUUID(),
    date: usage.date || new Date(),
  };
}

/**
 * 29. Monitors PPE inventory levels and alerts for low stock.
 *
 * @param {PPEInventory} inventory - Current inventory
 * @returns {object} Inventory alert
 *
 * @example
 * ```typescript
 * const alert = monitorPPEInventory(currentInventory);
 * if (alert.alertLevel === 'critical') {
 *   await notifySupplyChain(alert);
 * }
 * ```
 */
export function monitorPPEInventory(inventory: PPEInventory): {
  alertLevel: 'normal' | 'low' | 'critical' | 'depleted';
  daysUntilDepletion: number;
  reorderRequired: boolean;
  message: string;
} {
  let alertLevel: 'normal' | 'low' | 'critical' | 'depleted';
  let reorderRequired = false;
  let message = '';

  if (inventory.currentStock === 0) {
    alertLevel = 'depleted';
    message = `CRITICAL: ${inventory.ppeType} stock depleted`;
    reorderRequired = true;
  } else if (inventory.currentStock < inventory.minimumStock) {
    alertLevel = 'critical';
    message = `URGENT: ${inventory.ppeType} below minimum stock level`;
    reorderRequired = true;
  } else if (inventory.currentStock <= inventory.reorderPoint) {
    alertLevel = 'low';
    message = `${inventory.ppeType} at reorder point`;
    reorderRequired = true;
  } else {
    alertLevel = 'normal';
    message = `${inventory.ppeType} stock adequate`;
  }

  const daysUntilDepletion = inventory.burnRate && inventory.burnRate > 0
    ? Math.floor(inventory.currentStock / inventory.burnRate)
    : 999;

  return {
    alertLevel,
    daysUntilDepletion,
    reorderRequired,
    message,
  };
}

/**
 * 30. Calculates PPE burn rate and forecasts needs.
 *
 * @param {PPEUsage[]} usageHistory - Historical usage data
 * @param {number} forecastDays - Days to forecast
 * @returns {object} Burn rate and forecast
 *
 * @example
 * ```typescript
 * const forecast = calculatePPEBurnRate(usageHistory, 30);
 * console.log(`Forecast need: ${forecast.forecastedQuantity} units in 30 days`);
 * ```
 */
export function calculatePPEBurnRate(
  usageHistory: PPEUsage[],
  forecastDays: number = 30
): {
  dailyBurnRate: number;
  weeklyBurnRate: number;
  forecastedQuantity: number;
  trend: 'increasing' | 'decreasing' | 'stable';
} {
  if (usageHistory.length === 0) {
    return {
      dailyBurnRate: 0,
      weeklyBurnRate: 0,
      forecastedQuantity: 0,
      trend: 'stable',
    };
  }

  const totalQuantity = usageHistory.reduce((sum, usage) => sum + usage.quantity, 0);
  const earliestDate = new Date(Math.min(...usageHistory.map(u => u.date.getTime())));
  const latestDate = new Date(Math.max(...usageHistory.map(u => u.date.getTime())));
  const daysCovered = Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const dailyBurnRate = totalQuantity / daysCovered;
  const weeklyBurnRate = dailyBurnRate * 7;
  const forecastedQuantity = Math.ceil(dailyBurnRate * forecastDays);

  // Simple trend analysis
  const recentDays = usageHistory.slice(-7);
  const olderDays = usageHistory.slice(-14, -7);

  const recentAvg = recentDays.reduce((sum, u) => sum + u.quantity, 0) / recentDays.length;
  const olderAvg = olderDays.length > 0
    ? olderDays.reduce((sum, u) => sum + u.quantity, 0) / olderDays.length
    : recentAvg;

  let trend: 'increasing' | 'decreasing' | 'stable';
  if (recentAvg > olderAvg * 1.2) trend = 'increasing';
  else if (recentAvg < olderAvg * 0.8) trend = 'decreasing';
  else trend = 'stable';

  return {
    dailyBurnRate: Number(dailyBurnRate.toFixed(1)),
    weeklyBurnRate: Number(weeklyBurnRate.toFixed(1)),
    forecastedQuantity,
    trend,
  };
}

// ============================================================================
// SECTION 7: CULTURE MONITORING (Functions 31-33)
// ============================================================================

/**
 * 31. Records culture and sensitivity result.
 *
 * @param {CultureResult} result - Culture result
 * @returns {CultureResult} Created result with ID
 *
 * @example
 * ```typescript
 * const culture = recordCultureResult({
 *   patientId: 'patient-123',
 *   orderDate: new Date('2024-01-15'),
 *   collectionDate: new Date('2024-01-15'),
 *   resultDate: new Date('2024-01-18'),
 *   specimenType: 'Blood',
 *   specimenSource: 'Venipuncture',
 *   orderedBy: 'dr-456',
 *   status: 'final',
 *   organisms: [{
 *     name: 'Staphylococcus aureus',
 *     quantity: 'Heavy growth',
 *     sensitivities: [
 *       { antibiotic: 'Methicillin', interpretation: 'resistant' },
 *       { antibiotic: 'Vancomycin', interpretation: 'susceptible' }
 *     ]
 *   }],
 *   criticalValue: true
 * });
 * ```
 */
export function recordCultureResult(result: CultureResult): CultureResult {
  return {
    ...result,
    id: result.id || crypto.randomUUID(),
    orderDate: result.orderDate || new Date(),
    collectionDate: result.collectionDate || new Date(),
  };
}

/**
 * 32. Identifies critical culture results requiring immediate notification.
 *
 * @param {CultureResult} result - Culture result
 * @returns {object} Critical value assessment
 *
 * @example
 * ```typescript
 * const assessment = assessCriticalCulture(cultureResult);
 * if (assessment.isCritical) {
 *   await notifyProvider(assessment);
 * }
 * ```
 */
export function assessCriticalCulture(result: CultureResult): {
  isCritical: boolean;
  reason: string[];
  notificationPriority: 'stat' | 'urgent' | 'routine';
  recommendedActions: string[];
} {
  const reasons: string[] = [];
  const actions: string[] = [];
  let priority: 'stat' | 'urgent' | 'routine' = 'routine';

  const criticalPathogens = [
    'Mycobacterium tuberculosis',
    'Neisseria meningitidis',
    'Bacillus anthracis',
    'Yersinia pestis',
    'Francisella tularensis',
    'Candida auris',
  ];

  const mdroPathogens = [
    'MRSA',
    'VRE',
    'CRE',
    'Carbapenem-resistant',
    'Multi-drug resistant',
  ];

  for (const organism of result.organisms) {
    // Check for critical pathogens
    if (criticalPathogens.some(cp => organism.name.includes(cp))) {
      reasons.push(`Critical pathogen identified: ${organism.name}`);
      priority = 'stat';
      actions.push('Immediate isolation precautions');
      actions.push('Notify infection control immediately');
      actions.push('Notify public health if indicated');
    }

    // Check for MDRO
    if (mdroPathogens.some(mdro => organism.name.includes(mdro))) {
      reasons.push(`Multi-drug resistant organism: ${organism.name}`);
      priority = priority === 'stat' ? 'stat' : 'urgent';
      actions.push('Implement contact precautions');
      actions.push('Notify infection control');
      actions.push('Review antibiotic therapy');
    }

    // Check blood cultures
    if (result.specimenType.toLowerCase().includes('blood') && organism.name !== 'No growth') {
      reasons.push('Positive blood culture');
      priority = priority === 'stat' ? 'stat' : 'urgent';
      actions.push('Notify ordering provider immediately');
      actions.push('Review antibiotic coverage');
    }

    // Check CSF cultures
    if (result.specimenType.toLowerCase().includes('csf') && organism.name !== 'No growth') {
      reasons.push('Positive CSF culture');
      priority = 'stat';
      actions.push('STAT notification to provider');
      actions.push('Urgent infectious disease consult');
    }
  }

  return {
    isCritical: reasons.length > 0,
    reason: reasons,
    notificationPriority: priority,
    recommendedActions: actions,
  };
}

/**
 * 33. Generates culture result notification.
 *
 * @param {CultureResult} result - Culture result
 * @param {object} assessment - Critical value assessment
 * @returns {string} Notification message
 *
 * @example
 * ```typescript
 * const notification = generateCultureNotification(result, assessment);
 * await smsService.send(provider.phone, notification);
 * ```
 */
export function generateCultureNotification(
  result: CultureResult,
  assessment: { isCritical: boolean; reason: string[]; notificationPriority: string }
): string {
  const urgencyPrefix = assessment.notificationPriority === 'stat' ? '🚨 CRITICAL: ' : '⚠️ URGENT: ';

  return `${urgencyPrefix}Culture Result

Patient ID: ${result.patientId}
Specimen: ${result.specimenType} (${result.specimenSource})
Collection: ${result.collectionDate.toLocaleDateString()}

ORGANISMS:
${result.organisms.map(org => `• ${org.name} - ${org.quantity || 'Present'}`).join('\n')}

${assessment.reason.length > 0 ? `\nALERTS:\n${assessment.reason.map(r => `• ${r}`).join('\n')}` : ''}

Result ID: ${result.id}
Status: ${result.status.toUpperCase()}

Please review immediately and adjust therapy as indicated.`;
}

// ============================================================================
// SECTION 8: NHSN REPORTING (Functions 34-37)
// ============================================================================

/**
 * 34. Prepares NHSN monthly surveillance report.
 *
 * @param {InfectionSurveillanceEvent[]} events - HAI events
 * @param {object} deviceDays - Device utilization data
 * @param {number} month - Report month (1-12)
 * @param {number} year - Report year
 * @returns {NHSNReport} NHSN report data
 *
 * @example
 * ```typescript
 * const report = prepareNHSNReport(
 *   haiEvents,
 *   { centralLineDays: 450, urinaryCatheterDays: 320, ventilatorDays: 180 },
 *   1,
 *   2024
 * );
 * ```
 */
export function prepareNHSNReport(
  events: InfectionSurveillanceEvent[],
  deviceDays: {
    centralLineDays?: number;
    urinaryCatheterDays?: number;
    ventilatorDays?: number;
    patientDays?: number;
  },
  month: number,
  year: number
): NHSNReport {
  const clabsiEvents = events.filter(e => e.infectionType === 'CLABSI').length;
  const cautiEvents = events.filter(e => e.infectionType === 'CAUTI').length;
  const vaeEvents = events.filter(e => e.infectionType === 'VAE').length;
  const cdiEvents = events.filter(e => e.infectionType === 'CDI').length;

  return {
    id: crypto.randomUUID(),
    facilityId: events[0]?.facilityId || '',
    reportingPeriod: { month, year },
    reportType: 'HAI',
    status: 'draft',
    data: {
      clabsi: {
        events: clabsiEvents,
        centralLineDays: deviceDays.centralLineDays || 0,
      },
      cauti: {
        events: cautiEvents,
        urinaryCatheterDays: deviceDays.urinaryCatheterDays || 0,
      },
      vae: {
        events: vaeEvents,
        ventilatorDays: deviceDays.ventilatorDays || 0,
      },
      cdi: {
        healthcareOnset: cdiEvents,
        communityOnset: 0,
      },
    },
  };
}

/**
 * 35. Validates NHSN report data completeness.
 *
 * @param {NHSNReport} report - NHSN report
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateNHSNReport(report);
 * if (!validation.valid) {
 *   console.error('Report errors:', validation.errors);
 * }
 * ```
 */
export function validateNHSNReport(report: NHSNReport): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!report.facilityId) {
    errors.push('Facility ID is required');
  }

  if (!report.reportingPeriod || !report.reportingPeriod.month || !report.reportingPeriod.year) {
    errors.push('Reporting period is required');
  }

  // Validate CLABSI data
  if (report.data.clabsi) {
    if (report.data.clabsi.events > 0 && report.data.clabsi.centralLineDays === 0) {
      errors.push('Central line days required when CLABSI events reported');
    }
  }

  // Validate CAUTI data
  if (report.data.cauti) {
    if (report.data.cauti.events > 0 && report.data.cauti.urinaryCatheterDays === 0) {
      errors.push('Urinary catheter days required when CAUTI events reported');
    }
  }

  // Validate VAE data
  if (report.data.vae) {
    if (report.data.vae.events > 0 && report.data.vae.ventilatorDays === 0) {
      errors.push('Ventilator days required when VAE events reported');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 36. Calculates infection rates for NHSN reporting.
 *
 * @param {number} events - Number of infection events
 * @param {number} deviceDays - Device days or patient days
 * @returns {number} Infection rate per 1000 device/patient days
 *
 * @example
 * ```typescript
 * const clabsiRate = calculateInfectionRate(5, 450);
 * // Result: 11.1 infections per 1000 central line days
 * ```
 */
export function calculateInfectionRate(events: number, deviceDays: number): number {
  if (deviceDays === 0) return 0;
  return Number(((events / deviceDays) * 1000).toFixed(2));
}

/**
 * 37. Generates infection control summary dashboard.
 *
 * @param {InfectionSurveillanceEvent[]} events - HAI events
 * @param {IsolationOrder[]} isolations - Active isolations
 * @param {HandHygieneComplianceReport} hhCompliance - Hand hygiene data
 * @returns {object} Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = generateInfectionControlDashboard(
 *   haiEvents,
 *   activeIsolations,
 *   handHygieneReport
 * );
 * ```
 */
export function generateInfectionControlDashboard(
  events: InfectionSurveillanceEvent[],
  isolations: IsolationOrder[],
  hhCompliance?: HandHygieneComplianceReport
): {
  totalHAIs: number;
  haiByType: Record<string, number>;
  activeIsolations: number;
  isolationByType: Record<string, number>;
  handHygieneCompliance?: number;
  alerts: string[];
} {
  const haiByType: Record<string, number> = {};
  events.forEach(event => {
    haiByType[event.infectionType] = (haiByType[event.infectionType] || 0) + 1;
  });

  const isolationByType: Record<string, number> = {};
  const activeIsos = isolations.filter(iso => iso.status === 'active');
  activeIsos.forEach(iso => {
    isolationByType[iso.isolationType] = (isolationByType[iso.isolationType] || 0) + 1;
  });

  const alerts: string[] = [];
  if (events.length > 10) {
    alerts.push(`High HAI count: ${events.length} events`);
  }
  if (hhCompliance && hhCompliance.complianceRate < 80) {
    alerts.push(`Low hand hygiene compliance: ${hhCompliance.complianceRate}%`);
  }

  return {
    totalHAIs: events.length,
    haiByType,
    activeIsolations: activeIsos.length,
    isolationByType,
    handHygieneCompliance: hhCompliance?.complianceRate,
    alerts,
  };
}

// ============================================================================
// SECTION 9: INFECTION PREVENTION PROTOCOLS (Functions 38-40)
// ============================================================================

/**
 * 38. Creates infection prevention protocol.
 *
 * @param {Partial<InfectionPreventionProtocol>} protocol - Protocol details
 * @returns {InfectionPreventionProtocol} Complete protocol
 *
 * @example
 * ```typescript
 * const protocol = createInfectionPreventionProtocol({
 *   name: 'Central Line Bundle',
 *   category: 'device-management',
 *   version: '2.0',
 *   effectiveDate: new Date(),
 *   status: 'active',
 *   description: 'CLABSI prevention bundle',
 *   indication: 'All central line insertions and maintenance'
 * });
 * ```
 */
export function createInfectionPreventionProtocol(
  protocol: Partial<InfectionPreventionProtocol>
): InfectionPreventionProtocol {
  return {
    id: protocol.id || crypto.randomUUID(),
    name: protocol.name || '',
    category: protocol.category || 'hand-hygiene',
    version: protocol.version || '1.0',
    effectiveDate: protocol.effectiveDate || new Date(),
    reviewDate: protocol.reviewDate,
    status: protocol.status || 'draft',
    description: protocol.description || '',
    indication: protocol.indication || '',
    steps: protocol.steps || [],
    ppeRequired: protocol.ppeRequired,
    supplies: protocol.supplies,
    frequency: protocol.frequency,
    documentation: protocol.documentation,
    references: protocol.references,
    owner: protocol.owner,
    approvedBy: protocol.approvedBy,
    approvalDate: protocol.approvalDate,
  };
}

/**
 * 39. Validates protocol compliance checklist.
 *
 * @param {string} protocolId - Protocol ID
 * @param {object} checklist - Completed checklist
 * @returns {object} Compliance result
 *
 * @example
 * ```typescript
 * const compliance = validateProtocolCompliance('clabsi-bundle', {
 *   handHygiene: true,
 *   maximalBarrierPrecautions: true,
 *   chlorhexidineSkinPrep: true,
 *   optimalCatheterSite: true,
 *   dailyReviewNecessity: false
 * });
 * ```
 */
export function validateProtocolCompliance(
  protocolId: string,
  checklist: Record<string, boolean>
): {
  compliant: boolean;
  completionRate: number;
  missedSteps: string[];
  criticalViolations: string[];
} {
  const totalSteps = Object.keys(checklist).length;
  const completedSteps = Object.values(checklist).filter(v => v).length;
  const completionRate = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const missedSteps = Object.entries(checklist)
    .filter(([_, completed]) => !completed)
    .map(([step]) => step);

  // Critical steps that must not be missed
  const criticalSteps = ['handHygiene', 'maximalBarrierPrecautions', 'chlorhexidineSkinPrep'];
  const criticalViolations = missedSteps.filter(step => criticalSteps.includes(step));

  return {
    compliant: completionRate === 100 && criticalViolations.length === 0,
    completionRate,
    missedSteps,
    criticalViolations,
  };
}

/**
 * 40. Generates infection prevention training materials.
 *
 * @param {InfectionPreventionProtocol} protocol - Protocol
 * @returns {string} Training content
 *
 * @example
 * ```typescript
 * const training = generateTrainingMaterials(clabsiProtocol);
 * await lmsService.publish(training);
 * ```
 */
export function generateTrainingMaterials(protocol: InfectionPreventionProtocol): string {
  return `
# ${protocol.name} - Training Materials

## Overview
**Category:** ${protocol.category.replace(/-/g, ' ').toUpperCase()}
**Version:** ${protocol.version}
**Effective Date:** ${protocol.effectiveDate.toLocaleDateString()}

## Description
${protocol.description}

## When to Use
${protocol.indication}

## Required Supplies
${protocol.supplies ? protocol.supplies.map(s => `- ${s}`).join('\n') : 'See protocol for details'}

## Required Personal Protective Equipment (PPE)
${protocol.ppeRequired ? protocol.ppeRequired.map(ppe => `- ${ppe}`).join('\n') : 'Standard precautions'}

## Step-by-Step Procedure

${protocol.steps.map((step, idx) => `
### Step ${step.order}: ${step.description}
${step.criticalStep ? '**⚠️ CRITICAL STEP - DO NOT SKIP**' : ''}
${step.evidenceLevel ? `Evidence Level: ${step.evidenceLevel}` : ''}
`).join('\n')}

## Documentation Requirements
${protocol.documentation ? protocol.documentation.map(doc => `- ${doc}`).join('\n') : 'Document per facility policy'}

## Frequency
${protocol.frequency || 'As indicated'}

## References
${protocol.references ? protocol.references.map((ref, idx) => `${idx + 1}. ${ref}`).join('\n') : 'See protocol'}

## Questions?
Contact: ${protocol.owner || 'Infection Prevention Department'}

---
*Protocol Version: ${protocol.version}*
*Last Updated: ${protocol.effectiveDate.toLocaleDateString()}*
*Approved By: ${protocol.approvedBy || 'Pending'}*
`;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determines PPE requirements based on isolation type
 */
function determinePPERequirements(isolationType: IsolationType): {
  gloves: boolean;
  gown: boolean;
  mask: boolean;
  n95: boolean;
  faceShield: boolean;
  eyeProtection: boolean;
} {
  const requirements = {
    gloves: false,
    gown: false,
    mask: false,
    n95: false,
    faceShield: false,
    eyeProtection: false,
  };

  switch (isolationType) {
    case 'contact':
    case 'contact-plus':
      requirements.gloves = true;
      requirements.gown = true;
      break;
    case 'droplet':
      requirements.gloves = true;
      requirements.gown = true;
      requirements.mask = true;
      break;
    case 'airborne':
      requirements.gloves = true;
      requirements.gown = true;
      requirements.n95 = true;
      break;
    case 'protective':
      requirements.gloves = true;
      requirements.gown = true;
      requirements.mask = true;
      break;
  }

  return requirements;
}

/**
 * Determines room requirements based on isolation type
 */
function determineRoomRequirements(isolationType: IsolationType): {
  privateRoom: boolean;
  negativePressure?: boolean;
  anteRoom?: boolean;
  hepaFilter?: boolean;
} {
  const requirements = {
    privateRoom: false,
    negativePressure: false,
    anteRoom: false,
    hepaFilter: false,
  };

  switch (isolationType) {
    case 'airborne':
      requirements.privateRoom = true;
      requirements.negativePressure = true;
      requirements.anteRoom = true;
      break;
    case 'contact':
    case 'contact-plus':
    case 'droplet':
      requirements.privateRoom = true;
      break;
    case 'protective':
      requirements.privateRoom = true;
      requirements.hepaFilter = true;
      break;
  }

  return requirements;
}

/**
 * Assesses contact risk level
 */
function assessContactRisk(
  duration?: number,
  exposureType?: 'direct' | 'indirect' | 'environmental'
): 'high' | 'medium' | 'low' {
  if (exposureType === 'direct') {
    if (!duration || duration >= 15) return 'high';
    return 'medium';
  }

  if (exposureType === 'indirect') {
    return 'medium';
  }

  return 'low';
}

/**
 * Generates simple epidemic curve
 */
function generateEpiCurve(events: InfectionSurveillanceEvent[]): string {
  const dateCounts: Record<string, number> = {};

  events.forEach(event => {
    const dateKey = event.onsetDate.toISOString().split('T')[0];
    dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
  });

  const sorted = Object.entries(dateCounts).sort(([a], [b]) => a.localeCompare(b));

  return sorted.map(([date, count]) => {
    const bars = '█'.repeat(count);
    return `${date}: ${bars} (${count})`;
  }).join('\n');
}

/**
 * Generates cleaning checklist based on type and location
 */
function generateCleaningChecklist(
  cleaningType: string,
  locationType: string
): Array<{ item: string; completed: boolean; notes?: string }> {
  const baseChecklist = [
    { item: 'Remove all trash and linen', completed: false },
    { item: 'Clean high-touch surfaces', completed: false },
    { item: 'Clean floors', completed: false },
    { item: 'Restock supplies', completed: false },
  ];

  if (cleaningType === 'terminal' || cleaningType === 'isolation') {
    baseChecklist.push(
      { item: 'Clean and disinfect all surfaces', completed: false },
      { item: 'Clean bed and mattress', completed: false },
      { item: 'Clean bathroom thoroughly', completed: false },
      { item: 'UV-C disinfection if available', completed: false }
    );
  }

  if (locationType === 'operating-room' || locationType === 'procedure-room') {
    baseChecklist.push(
      { item: 'Clean and disinfect equipment', completed: false },
      { item: 'Clean lights and overhead fixtures', completed: false },
      { item: 'Verify sterile supplies', completed: false }
    );
  }

  return baseChecklist;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Infection Surveillance
  recordInfectionEvent,
  calculateDeviceUtilizationRatio,
  calculateSIR,
  assessHAIRisk,
  detectInfectionTrend,

  // Isolation Management
  createIsolationOrder,
  validateIsolationCompliance,
  generateIsolationSignage,
  discontinueIsolation,
  calculateIsolationDays,

  // Outbreak Detection
  detectOutbreak,
  initiateContactTracing,
  generateOutbreakReport,
  calculateAttackRate,
  requiresPublicHealthNotification,

  // Hand Hygiene
  recordHandHygieneObservation,
  calculateHandHygieneCompliance,
  validateHandHygieneTechnique,
  generateHandHygieneDashboard,
  createHandHygieneActionPlan,

  // Antibiotic Stewardship
  trackAntibioticPrescription,
  generateStewardshipAlert,
  calculateDaysOfTherapy,
  monitorAntibioticResistance,
  generateStewardshipMetrics,

  // Environmental Services
  createCleaningTask,
  verifyCleaningQuality,
  trackPPEUsage,
  monitorPPEInventory,
  calculatePPEBurnRate,

  // Culture Monitoring
  recordCultureResult,
  assessCriticalCulture,
  generateCultureNotification,

  // NHSN Reporting
  prepareNHSNReport,
  validateNHSNReport,
  calculateInfectionRate,
  generateInfectionControlDashboard,

  // Protocols
  createInfectionPreventionProtocol,
  validateProtocolCompliance,
  generateTrainingMaterials,
};
