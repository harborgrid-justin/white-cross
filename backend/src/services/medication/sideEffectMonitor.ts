/**
 * LOC: SE002MON
 * Side Effect Monitoring Service
 * 
 * Tracks adverse drug reactions (ADRs) and medication side effects
 * Supports FDA MedWatch reporting requirements
 * 
 * UPSTREAM (imports from):
 *   - database models
 *   - logger utility
 *   - audit service
 * 
 * DOWNSTREAM (imported by):
 *   - medication routes
 *   - health records services
 */

import { logger } from '../../utils/logger';
import { AuditService } from '../auditService';

/**
 * Side Effect Severity Levels (FDA Classification)
 */
export enum SideEffectSeverity {
  MILD = 'MILD',           // Minor discomfort, no intervention needed
  MODERATE = 'MODERATE',   // Some discomfort, may need intervention
  SEVERE = 'SEVERE',       // Significant symptoms, requires immediate attention
  LIFE_THREATENING = 'LIFE_THREATENING', // Immediate danger to life
  DEATH = 'DEATH'          // Fatal outcome
}

/**
 * Side Effect Categories (Body Systems)
 */
export enum SideEffectCategory {
  GASTROINTESTINAL = 'GASTROINTESTINAL',     // Nausea, vomiting, diarrhea
  CARDIOVASCULAR = 'CARDIOVASCULAR',         // Heart rate, blood pressure
  NEUROLOGICAL = 'NEUROLOGICAL',             // Headache, dizziness, drowsiness
  RESPIRATORY = 'RESPIRATORY',               // Breathing difficulty
  DERMATOLOGICAL = 'DERMATOLOGICAL',         // Rash, itching, hives
  PSYCHIATRIC = 'PSYCHIATRIC',               // Mood changes, anxiety
  ALLERGIC = 'ALLERGIC',                     // Allergic reactions
  METABOLIC = 'METABOLIC',                   // Blood sugar, electrolytes
  MUSCULOSKELETAL = 'MUSCULOSKELETAL',       // Muscle pain, weakness
  HEMATOLOGICAL = 'HEMATOLOGICAL',           // Blood disorders
  HEPATIC = 'HEPATIC',                       // Liver function
  RENAL = 'RENAL',                           // Kidney function
  OTHER = 'OTHER'
}

/**
 * Outcome of Side Effect
 */
export enum SideEffectOutcome {
  RECOVERED = 'RECOVERED',                   // Fully recovered
  RECOVERING = 'RECOVERING',                 // Still recovering
  NOT_RECOVERED = 'NOT_RECOVERED',           // Ongoing symptoms
  RECOVERED_WITH_SEQUELAE = 'RECOVERED_WITH_SEQUELAE', // Lasting effects
  FATAL = 'FATAL',                           // Death
  UNKNOWN = 'UNKNOWN'                        // Outcome not yet known
}

/**
 * Actions Taken
 */
export enum ActionTaken {
  NONE = 'NONE',                             // No action needed
  DOSE_REDUCED = 'DOSE_REDUCED',             // Reduced dosage
  DOSE_INCREASED = 'DOSE_INCREASED',         // Increased dosage
  MEDICATION_STOPPED = 'MEDICATION_STOPPED', // Discontinued medication
  MEDICATION_CHANGED = 'MEDICATION_CHANGED', // Switched to alternative
  SYMPTOMATIC_TREATMENT = 'SYMPTOMATIC_TREATMENT', // Treated symptoms
  HOSPITALIZED = 'HOSPITALIZED',             // Hospitalization required
  EMERGENCY_CARE = 'EMERGENCY_CARE',         // Emergency department visit
  MONITORING_INCREASED = 'MONITORING_INCREASED', // More frequent monitoring
  OTHER = 'OTHER'
}

/**
 * Side Effect Report
 */
export interface SideEffectReport {
  id: string;
  reportDate: Date;
  
  // Patient Information
  studentId: string;
  studentName: string;
  age: number;
  gender: string;
  
  // Medication Information
  medicationId: string;
  medicationName: string;
  genericName?: string;
  dosage: string;
  route: string; // oral, injection, topical, etc.
  startDate: Date;
  endDate?: Date;
  
  // Side Effect Details
  sideEffect: string;
  category: SideEffectCategory;
  severity: SideEffectSeverity;
  onsetDate: Date;
  onsetTimeAfterDose?: number; // minutes after dose
  description: string;
  
  // Clinical Information
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
  };
  
  // Assessment
  assessed: boolean;
  assessedBy?: string;
  assessmentDate?: Date;
  outcome: SideEffectOutcome;
  actionTaken: ActionTaken;
  actionDetails?: string;
  
  // Causality Assessment (Naranjo Score)
  causalityScore?: number; // 0-13 scale
  causalityAssessment?: 'Definite' | 'Probable' | 'Possible' | 'Doubtful';
  
  // Follow-up
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
  resolved: boolean;
  resolutionDate?: Date;
  
  // Reporting
  reportedToFDA: boolean;
  fdaReportNumber?: string;
  reportedToPhysician: boolean;
  reportedToPharmacy: boolean;
  reportedToParent: boolean;
  parentNotificationDate?: Date;
  
  // Documentation
  notes?: string;
  attachments?: string[]; // File paths/URLs
  
  // Audit Trail
  reportedBy: string;
  createdAt: Date;
  updatedAt?: Date;
  schoolId?: string;
  
  // Flags
  requiresImmediateAction: boolean;
  medwatchReportable: boolean; // FDA MedWatch serious criteria
}

/**
 * Side Effect Pattern (for trend analysis)
 */
export interface SideEffectPattern {
  medicationId: string;
  medicationName: string;
  sideEffect: string;
  category: SideEffectCategory;
  occurrences: number;
  severity: {
    mild: number;
    moderate: number;
    severe: number;
    lifeThreatening: number;
  };
  averageOnsetTime: number; // hours
  mostCommonOutcome: SideEffectOutcome;
  affectedStudents: string[];
}

/**
 * MedWatch Serious Criteria (FDA)
 */
const MEDWATCH_SERIOUS_CRITERIA = {
  death: true,
  lifeThreatening: true,
  hospitalization: true,
  disability: true,
  congenitalAnomaly: true,
  requiresInterventionToPreventPermanentImpairment: true
};

/**
 * Side Effect Monitoring Service
 */
export class SideEffectMonitor {
  
  // In-memory storage (replace with database in production)
  private static reports: SideEffectReport[] = [];
  
  /**
   * Report a side effect
   */
  static async reportSideEffect(
    report: Omit<SideEffectReport, 'id' | 'createdAt' | 'assessed' | 'resolved' | 'requiresImmediateAction' | 'medwatchReportable'>
  ): Promise<SideEffectReport> {
    try {
      const sideEffectReport: SideEffectReport = {
        ...report,
        id: this.generateReportId(),
        createdAt: new Date(),
        assessed: false,
        resolved: false,
        requiresImmediateAction: this.determineImmediateAction(report.severity, report.category),
        medwatchReportable: this.isMedwatchReportable(report.severity, report.outcome)
      };
      
      this.reports.push(sideEffectReport);
      
      // Audit log
      await AuditService.logAction({
        userId: report.reportedBy,
        action: 'CREATE_SIDE_EFFECT_REPORT',
        resourceType: 'SideEffectReport',
        resourceId: sideEffectReport.id,
        details: {
          studentId: report.studentId,
          medicationName: report.medicationName,
          sideEffect: report.sideEffect,
          severity: report.severity
        }
      });
      
      logger.info('Side effect reported', {
        reportId: sideEffectReport.id,
        medicationName: report.medicationName,
        sideEffect: report.sideEffect,
        severity: report.severity
      });
      
      // Alert for immediate action
      if (sideEffectReport.requiresImmediateAction) {
        await this.sendImmediateAlert(sideEffectReport);
      }
      
      // Alert for MedWatch reportable events
      if (sideEffectReport.medwatchReportable) {
        logger.warn('MedWatch reportable adverse event detected', {
          reportId: sideEffectReport.id,
          medicationName: report.medicationName,
          severity: report.severity
        });
      }
      
      return sideEffectReport;
      
    } catch (error) {
      logger.error('Error reporting side effect', { error, report });
      throw new Error('Failed to report side effect');
    }
  }
  
  /**
   * Assess a side effect report
   */
  static async assessReport(
    reportId: string,
    assessment: {
      assessedBy: string;
      outcome: SideEffectOutcome;
      actionTaken: ActionTaken;
      actionDetails?: string;
      causalityScore?: number;
      notes?: string;
    }
  ): Promise<SideEffectReport> {
    try {
      const report = this.reports.find(r => r.id === reportId);
      
      if (!report) {
        throw new Error('Side effect report not found');
      }
      
      report.assessed = true;
      report.assessedBy = assessment.assessedBy;
      report.assessmentDate = new Date();
      report.outcome = assessment.outcome;
      report.actionTaken = assessment.actionTaken;
      report.actionDetails = assessment.actionDetails;
      report.causalityScore = assessment.causalityScore;
      report.causalityAssessment = this.calculateCausalityAssessment(assessment.causalityScore);
      report.updatedAt = new Date();
      
      if (assessment.notes) {
        report.notes = report.notes ? `${report.notes}\n\nAssessment: ${assessment.notes}` : assessment.notes;
      }
      
      // Mark as resolved if outcome indicates resolution
      if (assessment.outcome === SideEffectOutcome.RECOVERED) {
        report.resolved = true;
        report.resolutionDate = new Date();
      }
      
      logger.info('Side effect report assessed', {
        reportId,
        assessedBy: assessment.assessedBy,
        outcome: assessment.outcome,
        actionTaken: assessment.actionTaken
      });
      
      return report;
      
    } catch (error) {
      logger.error('Error assessing side effect report', { error, reportId });
      throw error;
    }
  }
  
  /**
   * Add follow-up to a report
   */
  static async addFollowUp(
    reportId: string,
    followUp: {
      followUpBy: string;
      outcome: SideEffectOutcome;
      notes: string;
      resolved?: boolean;
    }
  ): Promise<SideEffectReport> {
    try {
      const report = this.reports.find(r => r.id === reportId);
      
      if (!report) {
        throw new Error('Side effect report not found');
      }
      
      report.followUpDate = new Date();
      report.followUpNotes = report.followUpNotes 
        ? `${report.followUpNotes}\n\n[${new Date().toISOString()}] ${followUp.notes}`
        : followUp.notes;
      report.outcome = followUp.outcome;
      report.updatedAt = new Date();
      
      if (followUp.resolved !== undefined) {
        report.resolved = followUp.resolved;
        if (followUp.resolved) {
          report.resolutionDate = new Date();
        }
      }
      
      logger.info('Follow-up added to side effect report', { reportId });
      
      return report;
      
    } catch (error) {
      logger.error('Error adding follow-up', { error, reportId });
      throw error;
    }
  }
  
  /**
   * Get side effect reports for a student
   */
  static async getStudentReports(studentId: string): Promise<SideEffectReport[]> {
    return this.reports
      .filter(r => r.studentId === studentId)
      .sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
  }
  
  /**
   * Get side effect reports for a medication
   */
  static async getMedicationReports(medicationId: string): Promise<SideEffectReport[]> {
    return this.reports
      .filter(r => r.medicationId === medicationId)
      .sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
  }
  
  /**
   * Get unassessed reports
   */
  static async getUnassessedReports(): Promise<SideEffectReport[]> {
    return this.reports
      .filter(r => !r.assessed)
      .sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
  }
  
  /**
   * Get reports requiring follow-up
   */
  static async getReportsRequiringFollowUp(): Promise<SideEffectReport[]> {
    const today = new Date();
    
    return this.reports.filter(r => 
      r.followUpRequired && 
      !r.resolved &&
      r.followUpDate &&
      r.followUpDate <= today
    );
  }
  
  /**
   * Get MedWatch reportable events
   */
  static async getMedwatchReportableEvents(startDate?: Date, endDate?: Date): Promise<SideEffectReport[]> {
    let reports = this.reports.filter(r => r.medwatchReportable);
    
    if (startDate) {
      reports = reports.filter(r => r.reportDate >= startDate);
    }
    
    if (endDate) {
      reports = reports.filter(r => r.reportDate <= endDate);
    }
    
    return reports.sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
  }
  
  /**
   * Analyze side effect patterns for a medication
   */
  static async analyzeMedicationPatterns(medicationId: string): Promise<SideEffectPattern[]> {
    const reports = await this.getMedicationReports(medicationId);
    
    // Group by side effect
    const patternMap = new Map<string, any>();
    
    for (const report of reports) {
      const key = `${report.sideEffect}-${report.category}`;
      
      if (!patternMap.has(key)) {
        patternMap.set(key, {
          medicationId: report.medicationId,
          medicationName: report.medicationName,
          sideEffect: report.sideEffect,
          category: report.category,
          occurrences: 0,
          severity: {
            mild: 0,
            moderate: 0,
            severe: 0,
            lifeThreatening: 0
          },
          onsetTimes: [],
          outcomes: {},
          affectedStudents: new Set()
        });
      }
      
      const pattern = patternMap.get(key);
      pattern.occurrences++;
      pattern.affectedStudents.add(report.studentId);
      
      // Count severity
      switch (report.severity) {
        case SideEffectSeverity.MILD:
          pattern.severity.mild++;
          break;
        case SideEffectSeverity.MODERATE:
          pattern.severity.moderate++;
          break;
        case SideEffectSeverity.SEVERE:
          pattern.severity.severe++;
          break;
        case SideEffectSeverity.LIFE_THREATENING:
        case SideEffectSeverity.DEATH:
          pattern.severity.lifeThreatening++;
          break;
      }
      
      // Track onset time
      if (report.onsetTimeAfterDose) {
        pattern.onsetTimes.push(report.onsetTimeAfterDose);
      }
      
      // Track outcomes
      pattern.outcomes[report.outcome] = (pattern.outcomes[report.outcome] || 0) + 1;
    }
    
    // Calculate patterns
    const patterns: SideEffectPattern[] = [];
    
    for (const [_, data] of patternMap) {
      const averageOnsetTime = data.onsetTimes.length > 0
        ? data.onsetTimes.reduce((a: number, b: number) => a + b, 0) / data.onsetTimes.length / 60 // Convert to hours
        : 0;
      
      // Find most common outcome
      let mostCommonOutcome = SideEffectOutcome.UNKNOWN;
      let maxCount = 0;
      
      for (const [outcome, count] of Object.entries(data.outcomes)) {
        if ((count as number) > maxCount) {
          maxCount = count as number;
          mostCommonOutcome = outcome as SideEffectOutcome;
        }
      }
      
      patterns.push({
        medicationId: data.medicationId,
        medicationName: data.medicationName,
        sideEffect: data.sideEffect,
        category: data.category,
        occurrences: data.occurrences,
        severity: data.severity,
        averageOnsetTime,
        mostCommonOutcome,
        affectedStudents: Array.from(data.affectedStudents)
      });
    }
    
    return patterns.sort((a, b) => b.occurrences - a.occurrences);
  }
  
  /**
   * Generate FDA MedWatch report data
   */
  static async generateMedwatchReportData(reportId: string): Promise<any> {
    const report = this.reports.find(r => r.id === reportId);
    
    if (!report) {
      throw new Error('Side effect report not found');
    }
    
    if (!report.medwatchReportable) {
      throw new Error('Report does not meet MedWatch serious criteria');
    }
    
    // FDA MedWatch Form 3500 format
    return {
      reportType: 'Adverse Event',
      reportDate: report.reportDate,
      
      // Patient Information (de-identified)
      patientInitials: this.getInitials(report.studentName),
      patientAge: report.age,
      patientGender: report.gender,
      patientWeight: null, // Would come from health records
      
      // Adverse Event
      adverseEvent: report.sideEffect,
      eventDescription: report.description,
      eventDate: report.onsetDate,
      outcome: this.mapToMedwatchOutcome(report.outcome),
      severity: report.severity,
      
      // Product (Medication)
      productName: report.medicationName,
      genericName: report.genericName,
      manufacturer: null, // Would need to be added
      lotNumber: null, // Would need to be added
      doseRoute: report.route,
      dosage: report.dosage,
      therapyDates: {
        start: report.startDate,
        end: report.endDate
      },
      
      // Reporter Information
      reporterType: 'Healthcare Professional',
      reporterName: report.reportedBy,
      reporterPhone: null, // Would need to be added
      reporterEmail: null, // Would need to be added
      
      // Additional Information
      concomitantMedications: [], // Would need to query student medications
      medicalHistory: [], // Would need to query student health records
      labData: report.vitalSigns,
      
      // Internal Tracking
      internalReportId: report.id,
      schoolId: report.schoolId
    };
  }
  
  /**
   * Mark report as reported to FDA
   */
  static async markReportedToFDA(reportId: string, fdaReportNumber: string): Promise<SideEffectReport> {
    const report = this.reports.find(r => r.id === reportId);
    
    if (!report) {
      throw new Error('Side effect report not found');
    }
    
    report.reportedToFDA = true;
    report.fdaReportNumber = fdaReportNumber;
    report.updatedAt = new Date();
    
    logger.info('Side effect reported to FDA', { reportId, fdaReportNumber });
    
    return report;
  }
  
  /**
   * Get side effect statistics
   */
  static async getStatistics(startDate: Date, endDate: Date): Promise<any> {
    const reports = this.reports.filter(r => 
      r.reportDate >= startDate && r.reportDate <= endDate
    );
    
    const totalReports = reports.length;
    const assessed = reports.filter(r => r.assessed).length;
    const resolved = reports.filter(r => r.resolved).length;
    const medwatchReportable = reports.filter(r => r.medwatchReportable).length;
    
    // By severity
    const bySeverity = {
      mild: reports.filter(r => r.severity === SideEffectSeverity.MILD).length,
      moderate: reports.filter(r => r.severity === SideEffectSeverity.MODERATE).length,
      severe: reports.filter(r => r.severity === SideEffectSeverity.SEVERE).length,
      lifeThreatening: reports.filter(r => r.severity === SideEffectSeverity.LIFE_THREATENING).length,
      death: reports.filter(r => r.severity === SideEffectSeverity.DEATH).length
    };
    
    // By category
    const byCategory: any = {};
    Object.values(SideEffectCategory).forEach(category => {
      byCategory[category] = reports.filter(r => r.category === category).length;
    });
    
    // By outcome
    const byOutcome: any = {};
    Object.values(SideEffectOutcome).forEach(outcome => {
      byOutcome[outcome] = reports.filter(r => r.outcome === outcome).length;
    });
    
    return {
      period: { start: startDate, end: endDate },
      totalReports,
      assessed,
      resolved,
      medwatchReportable,
      bySeverity,
      byCategory,
      byOutcome,
      assessmentRate: totalReports > 0 ? (assessed / totalReports * 100).toFixed(1) + '%' : '0%',
      resolutionRate: totalReports > 0 ? (resolved / totalReports * 100).toFixed(1) + '%' : '0%'
    };
  }
  
  // === Private helper methods ===
  
  private static generateReportId(): string {
    return `SE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private static determineImmediateAction(severity: SideEffectSeverity, category: SideEffectCategory): boolean {
    // Severe or life-threatening always requires immediate action
    if (severity === SideEffectSeverity.SEVERE || 
        severity === SideEffectSeverity.LIFE_THREATENING ||
        severity === SideEffectSeverity.DEATH) {
      return true;
    }
    
    // Certain categories require immediate attention even if moderate
    if (severity === SideEffectSeverity.MODERATE) {
      const criticalCategories = [
        SideEffectCategory.CARDIOVASCULAR,
        SideEffectCategory.RESPIRATORY,
        SideEffectCategory.ALLERGIC,
        SideEffectCategory.NEUROLOGICAL
      ];
      
      if (criticalCategories.includes(category)) {
        return true;
      }
    }
    
    return false;
  }
  
  private static isMedwatchReportable(severity: SideEffectSeverity, outcome: SideEffectOutcome): boolean {
    // Death is always reportable
    if (severity === SideEffectSeverity.DEATH || outcome === SideEffectOutcome.FATAL) {
      return true;
    }
    
    // Life-threatening events
    if (severity === SideEffectSeverity.LIFE_THREATENING) {
      return true;
    }
    
    // Hospitalizations (would need additional flag)
    // Disabilities or sequelae
    if (outcome === SideEffectOutcome.RECOVERED_WITH_SEQUELAE) {
      return true;
    }
    
    return false;
  }
  
  private static calculateCausalityAssessment(score?: number): 'Definite' | 'Probable' | 'Possible' | 'Doubtful' | undefined {
    if (score === undefined) return undefined;
    
    // Naranjo Algorithm scoring
    if (score >= 9) return 'Definite';
    if (score >= 5) return 'Probable';
    if (score >= 1) return 'Possible';
    return 'Doubtful';
  }
  
  private static async sendImmediateAlert(report: SideEffectReport): Promise<void> {
    logger.warn('IMMEDIATE ACTION REQUIRED - Serious side effect reported', {
      reportId: report.id,
      studentId: report.studentId,
      medicationName: report.medicationName,
      sideEffect: report.sideEffect,
      severity: report.severity
    });
    
    // TODO: Send notifications to nurse, physician, parent
    // This would integrate with the communication service
  }
  
  private static getInitials(fullName: string): string {
    const parts = fullName.split(' ');
    return parts.map(p => p.charAt(0)).join('').toUpperCase();
  }
  
  private static mapToMedwatchOutcome(outcome: SideEffectOutcome): string {
    const mapping: { [key in SideEffectOutcome]: string } = {
      [SideEffectOutcome.RECOVERED]: 'Recovered/Resolved',
      [SideEffectOutcome.RECOVERING]: 'Recovering/Resolving',
      [SideEffectOutcome.NOT_RECOVERED]: 'Not Recovered/Not Resolved',
      [SideEffectOutcome.RECOVERED_WITH_SEQUELAE]: 'Recovered/Resolved with Sequelae',
      [SideEffectOutcome.FATAL]: 'Fatal',
      [SideEffectOutcome.UNKNOWN]: 'Unknown'
    };
    
    return mapping[outcome];
  }
}
