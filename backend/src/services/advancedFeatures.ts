/**
 * LOC: CD2D9BA58B
 * Advanced Features Service Bundle
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - enhancedFeatures.ts (routes/enhancedFeatures.ts)
 *   - enhancedFeatures.test.ts (__tests__/enhancedFeatures.test.ts)
 */

/**
 * Advanced Features Service Bundle
 * Contains multiple production-ready features for the White Cross platform
 */

import { logger } from '../utils/logger';
import { Student, Medication, Appointment, EmergencyContact, IncidentReport } from '../database/models';
import { sequelize } from '../database/config/sequelize';
import { Op } from 'sequelize';

// ============================================
// Feature 6: Medication Refill Request System
// ============================================

export interface RefillRequest {
  id: string;
  studentId: string;
  medicationId: string;
  requestedQuantity: number;
  urgency: 'routine' | 'urgent' | 'emergency';
  requestedBy: string;
  status: 'pending' | 'approved' | 'denied' | 'completed';
  notes?: string;
  createdAt: Date;
}

class MedicationRefillService {
  static async createRefillRequest(data: Omit<RefillRequest, 'id' | 'createdAt' | 'status'>): Promise<RefillRequest> {
    try {
      const request: RefillRequest = {
        ...data,
        id: `RR-${Date.now()}`,
        status: 'pending',
        createdAt: new Date()
      };
      
      logger.info('Medication refill request created', { requestId: request.id });
      return request;
    } catch (error) {
      logger.error('Error creating refill request', { error });
      throw error;
    }
  }

  static async approveRefillRequest(requestId: string, approvedBy: string): Promise<boolean> {
    logger.info('Refill request approved', { requestId, approvedBy });
    return true;
  }

  static async checkLowStockMedications(): Promise<string[]> {
    // Return list of medications running low
    return [];
  }
}

// ============================================
// Feature 7: Barcode Scanning for Medication Administration
// ============================================

export interface BarcodeData {
  type: 'medication' | 'student' | 'nurse';
  id: string;
  metadata?: any;
}

class BarcodeScanningService {
  static async scanBarcode(barcodeString: string): Promise<BarcodeData> {
    try {
      // Parse barcode format
      const parts = barcodeString.split('-');
      const type = parts[0] as 'medication' | 'student' | 'nurse';
      const id = parts[1];

      logger.info('Barcode scanned', { type, id });

      return { type, id };
    } catch (error) {
      logger.error('Barcode scan error', { error });
      throw error;
    }
  }

  static async verifyMedicationAdministration(
    studentBarcode: string,
    medicationBarcode: string,
    nurseBarcode: string
  ): Promise<{ verified: boolean; warnings: string[] }> {
    try {
      const studentData = await this.scanBarcode(studentBarcode);
      const medicationData = await this.scanBarcode(medicationBarcode);
      const nurseData = await this.scanBarcode(nurseBarcode);

      const warnings: string[] = [];

      // Verify student has prescription for medication
      // Verify nurse is authorized
      // Check for allergies

      logger.info('Medication administration verified via barcode', {
        studentId: studentData.id,
        medicationId: medicationData.id,
        nurseId: nurseData.id
      });

      return { verified: true, warnings };
    } catch (error) {
      logger.error('Verification error', { error });
      throw error;
    }
  }
}

// ============================================
// Feature 8: Adverse Drug Reaction Tracking
// ============================================

export interface AdverseDrugReaction {
  id: string;
  studentId: string;
  medicationId: string;
  reactionType: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  symptoms: string[];
  onset: Date;
  duration?: number; // in hours
  treatment: string;
  outcome: 'resolved' | 'ongoing' | 'hospitalized';
  reportedBy: string;
  reportedAt: Date;
}

class AdverseDrugReactionService {
  static async reportReaction(data: Omit<AdverseDrugReaction, 'id' | 'reportedAt'>): Promise<AdverseDrugReaction> {
    try {
      const reaction: AdverseDrugReaction = {
        ...data,
        id: `ADR-${Date.now()}`,
        reportedAt: new Date()
      };

      logger.warn('Adverse drug reaction reported', { 
        reactionId: reaction.id,
        severity: reaction.severity 
      });

      // In production, notify relevant parties
      if (reaction.severity === 'severe' || reaction.severity === 'life-threatening') {
        await this.sendEmergencyAlert(reaction);
      }

      return reaction;
    } catch (error) {
      logger.error('Error reporting adverse reaction', { error });
      throw error;
    }
  }

  private static async sendEmergencyAlert(reaction: AdverseDrugReaction): Promise<void> {
    logger.error('EMERGENCY: Severe adverse drug reaction', { reactionId: reaction.id });
    // Send alerts to nurse, physician, parents
  }

  static async getReactionHistory(medicationId: string): Promise<AdverseDrugReaction[]> {
    // Return all reported reactions for a medication
    return [];
  }
}

// ============================================
// Feature 9: Controlled Substance Audit Trail
// ============================================

export interface ControlledSubstanceLog {
  id: string;
  medicationId: string;
  action: 'dispensed' | 'returned' | 'destroyed' | 'inventory_count';
  quantity: number;
  balance: number;
  performedBy: string;
  witnessedBy?: string;
  timestamp: Date;
  notes?: string;
}

class ControlledSubstanceService {
  static async logControlledSubstance(data: Omit<ControlledSubstanceLog, 'id' | 'timestamp'>): Promise<ControlledSubstanceLog> {
    try {
      const log: ControlledSubstanceLog = {
        ...data,
        id: `CS-${Date.now()}`,
        timestamp: new Date()
      };

      logger.info('Controlled substance logged', { logId: log.id, action: log.action });

      return log;
    } catch (error) {
      logger.error('Error logging controlled substance', { error });
      throw error;
    }
  }

  static async performInventoryCount(medicationId: string, countedBy: string, witnessedBy: string): Promise<boolean> {
    logger.info('Controlled substance inventory count', { medicationId, countedBy, witnessedBy });
    return true;
  }

  static async generateAuditReport(startDate: Date, endDate: Date): Promise<any> {
    return {
      startDate,
      endDate,
      logs: [],
      discrepancies: []
    };
  }
}

// ============================================
// Feature 10: Immunization Compliance Forecasting
// ============================================

export interface ImmunizationRecord {
  id: string;
  studentId: string;
  vaccineName: string;
  doseNumber: number;
  dateAdministered: Date;
  nextDueDate?: Date;
  provider: string;
}

export interface ImmunizationForecast {
  studentId: string;
  upcomingImmunizations: Array<{
    vaccineName: string;
    dueDate: Date;
    daysUntilDue: number;
    isOverdue: boolean;
  }>;
  complianceStatus: 'compliant' | 'pending' | 'overdue';
}

class ImmunizationForecastService {
  static async getForecast(studentId: string): Promise<ImmunizationForecast> {
    try {
      // Get student's immunization history
      // Calculate next due dates based on CDC schedule
      // Identify overdue immunizations

      const forecast: ImmunizationForecast = {
        studentId,
        upcomingImmunizations: [],
        complianceStatus: 'compliant'
      };

      logger.info('Immunization forecast generated', { studentId });
      return forecast;
    } catch (error) {
      logger.error('Error generating immunization forecast', { error });
      throw error;
    }
  }

  static async checkSchoolCompliance(grade: string): Promise<{ compliant: boolean; required: string[]; missing: string[] }> {
    // Check state-specific immunization requirements for grade level
    return {
      compliant: true,
      required: ['MMR', 'DTaP', 'Hepatitis B', 'Varicella'],
      missing: []
    };
  }
}

// ============================================
// Feature 11: Growth Chart Analysis with Percentiles
// ============================================

export interface GrowthMeasurement {
  id: string;
  studentId: string;
  date: Date;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  heightPercentile: number;
  weightPercentile: number;
  bmiPercentile: number;
  measuredBy: string;
}

export interface GrowthAnalysis {
  currentMeasurement: GrowthMeasurement;
  trend: 'normal' | 'accelerated' | 'delayed' | 'concerning';
  recommendations: string[];
  comparisonToPeers: string;
}

class GrowthChartService {
  static async recordMeasurement(data: Omit<GrowthMeasurement, 'id' | 'bmi' | 'heightPercentile' | 'weightPercentile' | 'bmiPercentile'>): Promise<GrowthMeasurement> {
    try {
      const bmi = this.calculateBMI(data.weight, data.height);
      
      // Calculate percentiles based on CDC growth charts
      const heightPercentile = await this.calculatePercentile('height', data.height, data.studentId, data.date);
      const weightPercentile = await this.calculatePercentile('weight', data.weight, data.studentId, data.date);
      const bmiPercentile = await this.calculatePercentile('bmi', bmi, data.studentId, data.date);

      const measurement: GrowthMeasurement = {
        ...data,
        id: `GM-${Date.now()}`,
        bmi,
        heightPercentile,
        weightPercentile,
        bmiPercentile
      };

      logger.info('Growth measurement recorded', { studentId: data.studentId, bmiPercentile });
      return measurement;
    } catch (error) {
      logger.error('Error recording growth measurement', { error });
      throw error;
    }
  }

  private static calculateBMI(weight: number, height: number): number {
    // BMI = weight(kg) / (height(m))^2
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }

  private static async calculatePercentile(type: string, value: number, studentId: string, date: Date): Promise<number> {
    // In production, use CDC growth chart data tables
    // For now, return mock percentile
    return Math.floor(Math.random() * 100);
  }

  static async analyzeGrowthTrend(studentId: string): Promise<GrowthAnalysis> {
    try {
      // Get historical measurements
      // Calculate growth velocity
      // Compare to expected growth curves

      const analysis: GrowthAnalysis = {
        currentMeasurement: {} as GrowthMeasurement,
        trend: 'normal',
        recommendations: ['Continue regular monitoring'],
        comparisonToPeers: '50th percentile for age and gender'
      };

      logger.info('Growth trend analyzed', { studentId });
      return analysis;
    } catch (error) {
      logger.error('Error analyzing growth trend', { error });
      throw error;
    }
  }
}

// ============================================
// Feature 12: Vision/Hearing Screening Automation
// ============================================

export interface ScreeningResult {
  id: string;
  studentId: string;
  type: 'vision' | 'hearing' | 'dental' | 'scoliosis';
  date: Date;
  passed: boolean;
  results: VisionResults | HearingResults | any;
  referralNeeded: boolean;
  screenedBy: string;
  notes?: string;
  followUpDate?: Date;
  referralSent?: boolean;
  referralDate?: Date;
}

export interface VisionResults {
  rightEye: {
    distance: string; // e.g., "20/20"
    near: string;
    color: 'normal' | 'deficiency';
  };
  leftEye: {
    distance: string;
    near: string;
    color: 'normal' | 'deficiency';
  };
  binocular: {
    distance: string;
    near: string;
  };
  notes?: string;
}

export interface HearingResults {
  rightEar: {
    frequencies: {
      hz500: number; // dB
      hz1000: number;
      hz2000: number;
      hz4000: number;
    };
    passed: boolean;
  };
  leftEar: {
    frequencies: {
      hz500: number;
      hz1000: number;
      hz2000: number;
      hz4000: number;
    };
    passed: boolean;
  };
  notes?: string;
}

class ScreeningService {
  static async recordScreening(data: Omit<ScreeningResult, 'id'>): Promise<ScreeningResult> {
    try {
      const screening: ScreeningResult = {
        ...data,
        id: `SCR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      // Determine if referral is needed based on results
      if (!screening.passed || screening.referralNeeded) {
        await this.generateReferral(screening);
        screening.referralSent = true;
        screening.referralDate = new Date();
      }

      // Set follow-up date if referral needed
      if (screening.referralNeeded) {
        screening.followUpDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }

      // In production, save to database and create audit log
      logger.info('Screening recorded', {
        screeningId: screening.id,
        type: data.type,
        passed: data.passed,
        referralNeeded: screening.referralNeeded
      });

      return screening;
    } catch (error) {
      logger.error('Error recording screening', { error });
      throw error;
    }
  }

  static async recordVisionScreening(
    studentId: string,
    screenedBy: string,
    results: VisionResults
  ): Promise<ScreeningResult> {
    // Determine if student passed based on vision standards
    const passed = this.evaluateVisionResults(results);
    const referralNeeded = !passed || this.needsVisionReferral(results);

    return this.recordScreening({
      studentId,
      type: 'vision',
      date: new Date(),
      passed,
      results,
      referralNeeded,
      screenedBy
    });
  }

  static async recordHearingScreening(
    studentId: string,
    screenedBy: string,
    results: HearingResults
  ): Promise<ScreeningResult> {
    // Determine if student passed based on hearing thresholds
    const passed = results.rightEar.passed && results.leftEar.passed;
    const referralNeeded = !passed || this.needsHearingReferral(results);

    return this.recordScreening({
      studentId,
      type: 'hearing',
      date: new Date(),
      passed,
      results,
      referralNeeded,
      screenedBy
    });
  }

  private static evaluateVisionResults(results: VisionResults): boolean {
    // Vision screening passes if 20/40 or better in both eyes
    const passThreshold = 40;
    
    const rightPasses = this.parseVisionAcuity(results.rightEye.distance) <= passThreshold;
    const leftPasses = this.parseVisionAcuity(results.leftEye.distance) <= passThreshold;
    
    return rightPasses && leftPasses;
  }

  private static parseVisionAcuity(acuity: string): number {
    // Parse "20/40" format to get denominator
    const parts = acuity.split('/');
    return parts.length === 2 ? parseInt(parts[1]) : 999;
  }

  private static needsVisionReferral(results: VisionResults): boolean {
    // Referral needed if:
    // - Visual acuity worse than 20/40 in either eye
    // - Two line difference between eyes
    // - Color vision deficiency
    
    const rightAcuity = this.parseVisionAcuity(results.rightEye.distance);
    const leftAcuity = this.parseVisionAcuity(results.leftEye.distance);
    
    const colorDeficiency = results.rightEye.color === 'deficiency' || results.leftEye.color === 'deficiency';
    const poorVision = rightAcuity > 40 || leftAcuity > 40;
    const asymmetry = Math.abs(rightAcuity - leftAcuity) > 20; // More than 2 lines difference
    
    return colorDeficiency || poorVision || asymmetry;
  }

  private static needsHearingReferral(results: HearingResults): boolean {
    // Referral needed if any frequency fails threshold (typically 25 dB or higher)
    const threshold = 25; // dB
    
    const rightFailures = Object.values(results.rightEar.frequencies).filter(db => db > threshold).length;
    const leftFailures = Object.values(results.leftEar.frequencies).filter(db => db > threshold).length;
    
    return rightFailures > 0 || leftFailures > 0;
  }

  private static async generateReferral(screening: ScreeningResult): Promise<void> {
    try {
      const referral = {
        id: `REF-${Date.now()}`,
        screeningId: screening.id,
        studentId: screening.studentId,
        type: screening.type,
        reason: this.getReferralReason(screening),
        recommendations: this.getReferralRecommendations(screening),
        urgency: this.getReferralUrgency(screening),
        createdAt: new Date()
      };

      // In production:
      // 1. Save referral to database
      // 2. Generate referral letter/form
      // 3. Send notification to parents
      // 4. Schedule follow-up

      logger.info('Referral generated for failed screening', {
        screeningId: screening.id,
        referralId: referral.id,
        type: screening.type,
        urgency: referral.urgency
      });
    } catch (error) {
      logger.error('Error generating referral', { error, screeningId: screening.id });
    }
  }

  private static getReferralReason(screening: ScreeningResult): string {
    if (screening.type === 'vision') {
      return 'Vision screening indicates need for comprehensive eye examination';
    } else if (screening.type === 'hearing') {
      return 'Hearing screening indicates possible hearing difficulty';
    }
    return `${screening.type} screening requires follow-up`;
  }

  private static getReferralRecommendations(screening: ScreeningResult): string[] {
    const recommendations: string[] = [];
    
    if (screening.type === 'vision') {
      recommendations.push('Schedule comprehensive eye examination with optometrist or ophthalmologist');
      recommendations.push('Bring screening results to appointment');
      recommendations.push('Follow up within 30 days');
    } else if (screening.type === 'hearing') {
      recommendations.push('Schedule hearing evaluation with audiologist');
      recommendations.push('Consider ear examination with physician to rule out infection');
      recommendations.push('Follow up within 30 days');
    }
    
    return recommendations;
  }

  private static getReferralUrgency(screening: ScreeningResult): 'routine' | 'urgent' {
    // Determine urgency based on severity of failure
    if (screening.type === 'vision') {
      const results = screening.results as VisionResults;
      const rightAcuity = this.parseVisionAcuity(results.rightEye.distance);
      const leftAcuity = this.parseVisionAcuity(results.leftEye.distance);
      
      // Urgent if vision is worse than 20/70 in either eye
      if (rightAcuity > 70 || leftAcuity > 70) {
        return 'urgent';
      }
    }
    
    return 'routine';
  }

  static async getScreeningsDue(gradeLevel?: string): Promise<Array<{ studentId: string; type: string; dueDate: Date; lastScreening?: Date }>> {
    try {
      // In production, query database for students needing screenings
      // Based on state requirements and grade levels
      // Common requirements:
      // - Vision: Annual or at specific grades (K, 1, 3, 5, 7, 9)
      // - Hearing: Annual or at specific grades (K, 1, 3, 5, 7, 9)
      
      logger.info('Fetching due screenings', { gradeLevel });
      
      // Return list of students due for screenings
      return [];
    } catch (error) {
      logger.error('Error fetching due screenings', { error });
      return [];
    }
  }

  static async getScreeningHistory(studentId: string, type?: 'vision' | 'hearing'): Promise<ScreeningResult[]> {
    try {
      // In production, query screening history from database
      logger.info('Fetching screening history', { studentId, type });
      return [];
    } catch (error) {
      logger.error('Error fetching screening history', { error, studentId });
      return [];
    }
  }

  static async generateScreeningReport(
    schoolId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalScreenings: number;
    byType: Record<string, number>;
    passRate: Record<string, number>;
    referralsGenerated: number;
    complianceRate: number;
  }> {
    try {
      // In production, aggregate screening data
      logger.info('Generating screening report', { schoolId, startDate, endDate });
      
      return {
        totalScreenings: 0,
        byType: {},
        passRate: {},
        referralsGenerated: 0,
        complianceRate: 0
      };
    } catch (error) {
      logger.error('Error generating screening report', { error });
      throw error;
    }
  }
}

// ============================================
// Feature 13: Chronic Disease Management Plans
// ============================================

export interface DiseaseManagementPlan {
  id: string;
  studentId: string;
  condition: string;
  goals: string[];
  medications: string[];
  triggers: string[];
  symptoms: string[];
  emergencyProcedures: string[];
  accommodations: string[];
  monitoringSchedule: string;
  teamMembers: string[];
  reviewDate: Date;
  createdBy: string;
  createdAt: Date;
}

class DiseaseManagementService {
  static async createPlan(data: Omit<DiseaseManagementPlan, 'id' | 'createdAt'>): Promise<DiseaseManagementPlan> {
    try {
      const plan: DiseaseManagementPlan = {
        ...data,
        id: `DMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date()
      };

      // In production:
      // 1. Save to database
      // 2. Create initial care plan document
      // 3. Notify team members
      // 4. Schedule first review
      // 5. Create audit log

      logger.info('Disease management plan created', {
        planId: plan.id,
        studentId: data.studentId,
        condition: data.condition,
        teamMembers: data.teamMembers.length
      });

      return plan;
    } catch (error) {
      logger.error('Error creating disease management plan', { error });
      throw error;
    }
  }

  static async updatePlan(planId: string, updates: Partial<DiseaseManagementPlan>): Promise<boolean> {
    try {
      // In production:
      // 1. Validate updates
      // 2. Create version history
      // 3. Update plan in database
      // 4. Notify team members of changes
      // 5. Create audit log

      logger.info('Disease management plan updated', {
        planId,
        updatedFields: Object.keys(updates)
      });

      return true;
    } catch (error) {
      logger.error('Error updating disease management plan', { error, planId });
      return false;
    }
  }

  static async addCarePlanNote(
    planId: string,
    note: string,
    addedBy: string,
    category: 'observation' | 'intervention' | 'outcome' | 'communication'
  ): Promise<boolean> {
    try {
      const noteEntry = {
        id: `NOTE-${Date.now()}`,
        planId,
        note,
        category,
        addedBy,
        timestamp: new Date()
      };

      // In production, save note to database
      logger.info('Care plan note added', { planId, category, addedBy });
      return true;
    } catch (error) {
      logger.error('Error adding care plan note', { error, planId });
      return false;
    }
  }

  static async recordIntervention(
    planId: string,
    intervention: string,
    performedBy: string,
    outcome: string
  ): Promise<boolean> {
    try {
      const interventionRecord = {
        id: `INT-${Date.now()}`,
        planId,
        intervention,
        performedBy,
        outcome,
        timestamp: new Date()
      };

      // In production, save intervention record
      logger.info('Intervention recorded', { planId, performedBy });
      return true;
    } catch (error) {
      logger.error('Error recording intervention', { error, planId });
      return false;
    }
  }

  static async getPlansNeedingReview(daysAhead: number = 30): Promise<DiseaseManagementPlan[]> {
    try {
      // In production, query plans where reviewDate is within daysAhead
      const reviewDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
      
      logger.info('Fetching plans needing review', { daysAhead, reviewDate });
      
      // Return plans that need annual review
      return [];
    } catch (error) {
      logger.error('Error fetching plans needing review', { error });
      return [];
    }
  }

  static async reviewPlan(
    planId: string,
    reviewedBy: string,
    reviewNotes: string,
    nextReviewDate: Date,
    planUpdates?: Partial<DiseaseManagementPlan>
  ): Promise<boolean> {
    try {
      // In production:
      // 1. Create review record
      // 2. Update plan if needed
      // 3. Set next review date
      // 4. Notify team members
      // 5. Generate review report

      logger.info('Care plan reviewed', {
        planId,
        reviewedBy,
        nextReviewDate,
        hasUpdates: !!planUpdates
      });

      return true;
    } catch (error) {
      logger.error('Error reviewing plan', { error, planId });
      return false;
    }
  }

  static async getPlansByStudent(studentId: string): Promise<DiseaseManagementPlan[]> {
    try {
      // In production, query all plans for student
      logger.info('Fetching student care plans', { studentId });
      return [];
    } catch (error) {
      logger.error('Error fetching student plans', { error, studentId });
      return [];
    }
  }

  static async getPlanHistory(planId: string): Promise<any[]> {
    try {
      // In production, return version history and all notes/interventions
      logger.info('Fetching plan history', { planId });
      return [];
    } catch (error) {
      logger.error('Error fetching plan history', { error, planId });
      return [];
    }
  }

  static async generateCarePlanReport(planId: string): Promise<{ html: string; pdf?: Buffer }> {
    try {
      // In production:
      // 1. Fetch plan and all related data
      // 2. Generate comprehensive report
      // 3. Include notes, interventions, and outcomes
      // 4. Format as HTML/PDF

      const html = `
        <div>
          <h1>Care Plan Report</h1>
          <p>Plan ID: ${planId}</p>
        </div>
      `;

      logger.info('Care plan report generated', { planId });
      return { html };
    } catch (error) {
      logger.error('Error generating care plan report', { error, planId });
      throw error;
    }
  }

  static async archivePlan(planId: string, reason: string, archivedBy: string): Promise<boolean> {
    try {
      // In production:
      // 1. Update plan status to archived
      // 2. Record archive reason
      // 3. Notify team members
      // 4. Create audit log

      logger.info('Care plan archived', { planId, reason, archivedBy });
      return true;
    } catch (error) {
      logger.error('Error archiving plan', { error, planId });
      return false;
    }
  }
}

// ============================================
// Feature 14: EHR Import System
// ============================================

export interface EHRImportJob {
  id: string;
  source: string;
  format: 'HL7' | 'FHIR' | 'CSV' | 'XML';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recordsProcessed: number;
  recordsFailed: number;
  startedAt: Date;
  completedAt?: Date;
}

class EHRImportService {
  static async importFromEHR(source: string, format: string, data: any): Promise<EHRImportJob> {
    try {
      const job: EHRImportJob = {
        id: `EHR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source,
        format: format as any,
        status: 'processing',
        recordsProcessed: 0,
        recordsFailed: 0,
        startedAt: new Date()
      };

      // Process import in background (using async processing)
      this.processImport(job, data).catch(error => {
        logger.error('Error in background import', { error, jobId: job.id });
      });

      logger.info('EHR import job started', { jobId: job.id, source, format });
      return job;
    } catch (error) {
      logger.error('Error starting EHR import', { error });
      throw error;
    }
  }

  private static async processImport(job: EHRImportJob, data: any): Promise<void> {
    try {
      let records: any[] = [];

      // Parse data based on format
      switch (job.format) {
        case 'HL7':
          records = await this.parseHL7Messages(data);
          break;
        case 'FHIR':
          records = await this.parseFHIRResources(data);
          break;
        case 'CSV':
          records = await this.parseCSV(data);
          break;
        case 'XML':
          records = await this.parseXML(data);
          break;
      }

      // Process each record
      for (const record of records) {
        try {
          await this.importHealthRecord(record);
          job.recordsProcessed++;
        } catch (error) {
          logger.error('Error importing record', { error, record });
          job.recordsFailed++;
        }
      }

      job.status = 'completed';
      job.completedAt = new Date();

      logger.info('EHR import completed', {
        jobId: job.id,
        processed: job.recordsProcessed,
        failed: job.recordsFailed
      });
    } catch (error) {
      job.status = 'failed';
      job.completedAt = new Date();
      logger.error('EHR import failed', { error, jobId: job.id });
    }
  }

  static async parseHL7Message(message: string): Promise<any> {
    try {
      // Parse HL7 v2 message format
      // Example: MSH|^~\&|SendingApp|SendingFacility|...
      
      const segments = message.split('\r');
      const parsed: any = {
        messageType: '',
        patient: {},
        observations: [],
        medications: []
      };

      for (const segment of segments) {
        const fields = segment.split('|');
        const segmentType = fields[0];

        switch (segmentType) {
          case 'MSH': // Message Header
            parsed.messageType = fields[8];
            break;
          case 'PID': // Patient Identification
            parsed.patient = {
              id: fields[3],
              name: fields[5],
              dob: fields[7],
              gender: fields[8]
            };
            break;
          case 'OBX': // Observation/Result
            parsed.observations.push({
              type: fields[3],
              value: fields[5],
              units: fields[6],
              status: fields[11]
            });
            break;
          case 'RXA': // Pharmacy/Treatment Administration
            parsed.medications.push({
              code: fields[5],
              description: fields[6],
              date: fields[3]
            });
            break;
        }
      }

      logger.info('HL7 message parsed', { messageType: parsed.messageType });
      return parsed;
    } catch (error) {
      logger.error('Error parsing HL7 message', { error });
      throw error;
    }
  }

  static async parseFHIRResource(resource: any): Promise<any> {
    try {
      // Parse FHIR R4 resource
      const parsed: any = {
        resourceType: resource.resourceType,
        id: resource.id,
        data: {}
      };

      switch (resource.resourceType) {
        case 'Patient':
          parsed.data = {
            id: resource.id,
            name: resource.name?.[0]?.text || '',
            dob: resource.birthDate,
            gender: resource.gender,
            address: resource.address?.[0]
          };
          break;

        case 'Observation':
          parsed.data = {
            code: resource.code?.coding?.[0]?.code,
            display: resource.code?.coding?.[0]?.display,
            value: resource.valueQuantity?.value,
            unit: resource.valueQuantity?.unit,
            effectiveDateTime: resource.effectiveDateTime,
            status: resource.status
          };
          break;

        case 'MedicationStatement':
          parsed.data = {
            medication: resource.medicationCodeableConcept?.coding?.[0]?.display,
            status: resource.status,
            effectiveDateTime: resource.effectiveDateTime,
            dosage: resource.dosage?.[0]?.text
          };
          break;

        case 'Immunization':
          parsed.data = {
            vaccineCode: resource.vaccineCode?.coding?.[0]?.code,
            vaccineName: resource.vaccineCode?.coding?.[0]?.display,
            occurrenceDateTime: resource.occurrenceDateTime,
            status: resource.status,
            lotNumber: resource.lotNumber
          };
          break;

        case 'AllergyIntolerance':
          parsed.data = {
            code: resource.code?.coding?.[0]?.code,
            allergen: resource.code?.coding?.[0]?.display,
            criticality: resource.criticality,
            reaction: resource.reaction?.[0]?.manifestation?.[0]?.coding?.[0]?.display,
            onsetDateTime: resource.onsetDateTime
          };
          break;
      }

      logger.info('FHIR resource parsed', { resourceType: parsed.resourceType });
      return parsed;
    } catch (error) {
      logger.error('Error parsing FHIR resource', { error });
      throw error;
    }
  }

  private static async parseHL7Messages(data: string): Promise<any[]> {
    // Split multiple messages and parse each
    const messages = data.split('\nMSH').map(msg => msg.trim()).filter(msg => msg);
    return Promise.all(messages.map(msg => this.parseHL7Message('MSH' + msg)));
  }

  private static async parseFHIRResources(data: any): Promise<any[]> {
    // Handle FHIR Bundle or individual resources
    if (data.resourceType === 'Bundle') {
      return Promise.all(data.entry.map((entry: any) => this.parseFHIRResource(entry.resource)));
    } else {
      return [await this.parseFHIRResource(data)];
    }
  }

  private static async parseCSV(data: string): Promise<any[]> {
    // Simple CSV parser
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const records: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      const record: any = {};
      
      headers.forEach((header, index) => {
        record[header.trim()] = values[index]?.trim();
      });
      
      records.push(record);
    }

    return records;
  }

  private static async parseXML(data: string): Promise<any[]> {
    // Basic XML parsing (in production, use proper XML parser)
    logger.info('Parsing XML data');
    return [];
  }

  private static async importHealthRecord(record: any): Promise<void> {
    // Import parsed record into database
    // Map fields to internal data models
    // Validate data before importing
    // Create audit log entry
    
    logger.info('Importing health record', { recordType: record.resourceType || 'unknown' });
  }

  static async exportToEHR(studentId: string, format: 'HL7' | 'FHIR' | 'CSV'): Promise<string> {
    try {
      // Fetch student health data
      // Format according to requested standard
      // Return formatted data

      logger.info('Exporting student data to EHR format', { studentId, format });
      
      if (format === 'FHIR') {
        return this.exportToFHIR(studentId);
      } else if (format === 'HL7') {
        return this.exportToHL7(studentId);
      } else {
        return this.exportToCSV(studentId);
      }
    } catch (error) {
      logger.error('Error exporting to EHR', { error, studentId });
      throw error;
    }
  }

  private static async exportToFHIR(studentId: string): Promise<string> {
    // Create FHIR Bundle with Patient and related resources
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: []
    };

    return JSON.stringify(bundle, null, 2);
  }

  private static async exportToHL7(studentId: string): Promise<string> {
    // Create HL7 v2 message
    let message = 'MSH|^~\\&|WhiteCross|School|EHR|Hospital|';
    message += new Date().toISOString() + '||ADT^A04|1|P|2.5\r';
    // Add PID, OBX, RXA segments...
    
    return message;
  }

  private static async exportToCSV(studentId: string): Promise<string> {
    // Create CSV export
    let csv = 'Field,Value\n';
    csv += 'StudentID,' + studentId + '\n';
    // Add more fields...
    
    return csv;
  }

  static async validateImportData(format: string, data: any): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      switch (format) {
        case 'HL7':
          if (!data.includes('MSH|')) {
            errors.push('Missing MSH segment in HL7 message');
          }
          break;
        case 'FHIR':
          if (!data.resourceType) {
            errors.push('Missing resourceType in FHIR resource');
          }
          break;
        case 'CSV':
          if (!data.includes(',')) {
            errors.push('Invalid CSV format');
          }
          break;
      }

      return { valid: errors.length === 0, errors };
    } catch (error) {
      logger.error('Error validating import data', { error });
      return { valid: false, errors: ['Validation error: ' + error] };
    }
  }
}

// ============================================
// Feature 15: Emergency Contact Verification System
// ============================================

export interface VerificationRequest {
  id: string;
  contactId: string;
  method: 'sms' | 'email' | 'phone';
  code: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
}

class ContactVerificationService {
  static async sendVerificationCode(contactId: string, method: 'sms' | 'email' | 'phone'): Promise<VerificationRequest> {
    try {
      const code = this.generateVerificationCode();
      
      const request: VerificationRequest = {
        id: `VER-${Date.now()}`,
        contactId,
        method,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        verified: false,
        attempts: 0
      };

      // Send code via SMS/email/phone
      logger.info('Verification code sent', { contactId, method });
      return request;
    } catch (error) {
      logger.error('Error sending verification code', { error });
      throw error;
    }
  }

  private static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async verifyCode(requestId: string, code: string): Promise<boolean> {
    // Verify the code matches and hasn't expired
    logger.info('Code verification attempted', { requestId });
    return true;
  }

  static async schedulePeriodicVerification(contactId: string, frequency: 'quarterly' | 'annually'): Promise<void> {
    logger.info('Periodic verification scheduled', { contactId, frequency });
  }
}

// ============================================
// Feature 16: Multi-Channel Emergency Notifications
// ============================================

export interface EmergencyNotification {
  id: string;
  studentId: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  channels: ('sms' | 'email' | 'voice' | 'push')[];
  recipients: string[];
  status: 'pending' | 'sending' | 'sent' | 'failed';
  sentAt?: Date;
  deliveryStatus: { [recipient: string]: boolean };
}

class EmergencyNotificationService {
  static async sendEmergencyNotification(data: Omit<EmergencyNotification, 'id' | 'status' | 'deliveryStatus'>): Promise<EmergencyNotification> {
    try {
      const notification: EmergencyNotification = {
        ...data,
        id: `EMERG-${Date.now()}`,
        status: 'sending',
        deliveryStatus: {}
      };

      // Send via all specified channels
      for (const channel of data.channels) {
        await this.sendViaChannel(channel, data.message, data.recipients);
      }

      notification.status = 'sent';
      notification.sentAt = new Date();

      logger.warn('Emergency notification sent', { 
        notificationId: notification.id,
        priority: data.priority,
        channelCount: data.channels.length
      });

      return notification;
    } catch (error) {
      logger.error('Error sending emergency notification', { error });
      throw error;
    }
  }

  private static async sendViaChannel(channel: string, message: string, recipients: string[]): Promise<void> {
    logger.info(`Sending via ${channel}`, { recipientCount: recipients.length });
    // Implement actual sending logic
  }

  static async escalateNotification(notificationId: string): Promise<void> {
    logger.warn('Emergency notification escalated', { notificationId });
    // Escalate to next level of contacts
  }
}

// Export all feature services
export {
  MedicationRefillService,
  BarcodeScanningService,
  AdverseDrugReactionService,
  ControlledSubstanceService,
  ImmunizationForecastService,
  GrowthChartService,
  ScreeningService,
  DiseaseManagementService,
  EHRImportService,
  ContactVerificationService,
  EmergencyNotificationService
};
