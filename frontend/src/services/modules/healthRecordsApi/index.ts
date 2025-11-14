/**
 * Health Records API - Unified Interface
 * 
 * Comprehensive health records management system with modular architecture.
 * This module provides a unified interface for all health record operations
 * while maintaining backward compatibility with the original healthRecordsApi.
 * 
 * Features:
 * - Complete health records management
 * - Allergies tracking and safety monitoring
 * - Chronic conditions with care plan management
 * - Vaccination compliance tracking
 * - Health screenings with referral management
 * - Growth measurements with trend analysis
 * - Vital signs monitoring with alerts
 * - PHI access logging for HIPAA compliance
 * - Comprehensive validation and error handling
 * 
 * @module services/modules/healthRecordsApi
 */

import type { ApiClient } from '../../core/ApiClient';

// ==========================================
// SERVICE IMPORTS
// ==========================================

import { 
  HealthRecordsService,
  createHealthRecordsService 
} from './records';

import { 
  AllergiesService,
  createAllergiesService 
} from './allergies';

import { 
  ChronicConditionsService,
  createChronicConditionsService 
} from './conditions';

import { 
  VaccinationsService,
  createVaccinationsService 
} from './vaccinations';

import { 
  ScreeningsService,
  createScreeningsService 
} from './screenings';

import { 
  GrowthService,
  createGrowthService 
} from './growth';

import { 
  VitalSignsService,
  createVitalSignsService 
} from './vitals';

// ==========================================
// TYPE EXPORTS
// ==========================================

export * from './types';

// ==========================================
// SERVICE EXPORTS
// ==========================================

export {
  HealthRecordsService,
  AllergiesService,
  ChronicConditionsService,
  VaccinationsService,
  ScreeningsService,
  GrowthService,
  VitalSignsService
};

export {
  createHealthRecordsService,
  createAllergiesService,
  createChronicConditionsService,
  createVaccinationsService,
  createScreeningsService,
  createGrowthService,
  createVitalSignsService
};

// ==========================================
// UNIFIED HEALTH RECORDS API CLASS
// ==========================================

/**
 * Comprehensive Health Records API
 * 
 * Provides a unified interface to all health record services while maintaining
 * the modular architecture. Each service can be accessed individually or through
 * this unified interface.
 */
export class HealthRecordsApi {
  // Core services
  public readonly records: HealthRecordsService;
  public readonly allergies: AllergiesService;
  public readonly conditions: ChronicConditionsService;
  public readonly vaccinations: VaccinationsService;
  public readonly screenings: ScreeningsService;
  public readonly growth: GrowthService;
  public readonly vitals: VitalSignsService;

  constructor(private readonly client: ApiClient) {
    // Initialize all services
    this.records = createHealthRecordsService(client);
    this.allergies = createAllergiesService(client);
    this.conditions = createChronicConditionsService(client);
    this.vaccinations = createVaccinationsService(client);
    this.screenings = createScreeningsService(client);
    this.growth = createGrowthService(client);
    this.vitals = createVitalSignsService(client);
  }

  // ==========================================
  // CONVENIENCE METHODS
  // ==========================================

  /**
   * Get complete health profile for a student
   * Aggregates data from all health record modules
   */
  async getCompleteHealthProfile(studentId: string) {
    const [
      summary,
      allergies,
      conditions,
      vaccinations,
      recentScreenings,
      latestGrowth,
      latestVitals
    ] = await Promise.all([
      this.records.getSummary(studentId),
      this.allergies.getAllergies(studentId),
      this.conditions.getActiveConditions(studentId),
      this.vaccinations.getVaccinations(studentId),
      this.screenings.getScreenings(studentId),
      this.growth.getLatestMeasurement(studentId),
      this.vitals.getLatestVitalSigns(studentId)
    ]);

    return {
      summary,
      allergies,
      conditions,
      vaccinations,
      recentScreenings: recentScreenings.slice(0, 5), // Last 5 screenings
      latestGrowth,
      latestVitals
    };
  }

  /**
   * Get critical health alerts for a student
   * Aggregates all critical information across modules
   */
  async getCriticalAlerts(studentId: string) {
    const [
      criticalAllergies,
      activeConditions,
      complianceCheck,
      vitalAlerts
    ] = await Promise.all([
      this.allergies.getCriticalAllergies(studentId),
      this.conditions.getActiveConditions(studentId),
      this.vaccinations.checkCompliance(studentId),
      this.vitals.getLatestVitalSigns(studentId)
    ]);

    const alerts = [];

    // Critical allergies
    if (criticalAllergies.length > 0) {
      alerts.push({
        type: 'critical_allergies',
        severity: 'high',
        message: `${criticalAllergies.length} critical allergies on file`,
        data: criticalAllergies
      });
    }

    // Active severe conditions
    const severeConditions = activeConditions.filter(c => 
      c.severity === 'SEVERE' || c.severity === 'CRITICAL'
    );
    if (severeConditions.length > 0) {
      alerts.push({
        type: 'severe_conditions',
        severity: 'high',
        message: `${severeConditions.length} severe medical conditions`,
        data: severeConditions
      });
    }

    // Vaccination non-compliance
    if (!complianceCheck.isCompliant) {
      alerts.push({
        type: 'vaccination_noncompliance',
        severity: 'medium',
        message: `Missing ${complianceCheck.missingVaccinations.length} required vaccinations`,
        data: complianceCheck.missingVaccinations
      });
    }

    return alerts;
  }

  /**
   * Get emergency medical information for a student
   * Critical information needed in emergency situations
   */
  async getEmergencyMedicalInfo(studentId: string) {
    const [
      criticalAllergies,
      emergencyProtocols,
      activeConditions,
      latestVitals
    ] = await Promise.all([
      this.allergies.getCriticalAllergies(studentId),
      this.conditions.getEmergencyProtocols(studentId),
      this.conditions.getActiveConditions(studentId),
      this.vitals.getLatestVitalSigns(studentId)
    ]);

    return {
      criticalAllergies,
      emergencyProtocols,
      activeConditions: activeConditions.filter(c => 
        c.severity === 'SEVERE' || c.severity === 'CRITICAL'
      ),
      latestVitals,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Check if student needs immediate medical attention
   * Based on latest vitals and active conditions
   */
  async checkImmediateAttentionNeeded(studentId: string) {
    const [
      latestVitals,
      activeConditions,
      criticalAllergies
    ] = await Promise.all([
      this.vitals.getLatestVitalSigns(studentId),
      this.conditions.getActiveConditions(studentId),
      this.allergies.getCriticalAllergies(studentId)
    ]);

    const immediateAttention = {
      needed: false,
      reasons: [] as string[],
      severity: 'normal' as 'normal' | 'concerning' | 'critical',
      recommendations: [] as string[]
    };

    // Check vitals if available
    if (latestVitals) {
      const vitalChecks = await this.vitals.checkNormalRanges(studentId, {
        temperature: latestVitals.temperature,
        bloodPressureSystolic: latestVitals.bloodPressureSystolic,
        bloodPressureDiastolic: latestVitals.bloodPressureDiastolic,
        heartRate: latestVitals.heartRate,
        respiratoryRate: latestVitals.respiratoryRate,
        oxygenSaturation: latestVitals.oxygenSaturation,
        glucose: latestVitals.glucose
      });

      if (vitalChecks.overallStatus === 'critical') {
        immediateAttention.needed = true;
        immediateAttention.severity = 'critical';
        immediateAttention.reasons.push('Critical vital signs detected');
        immediateAttention.recommendations.push(...vitalChecks.recommendations);
      } else if (vitalChecks.overallStatus === 'concerning') {
        immediateAttention.severity = 'concerning';
        immediateAttention.reasons.push('Concerning vital signs detected');
      }
    }

    // Check for critical conditions
    const criticalConditions = activeConditions.filter(c => 
      c.severity === 'CRITICAL'
    );
    if (criticalConditions.length > 0) {
      immediateAttention.severity = immediateAttention.severity === 'critical' ? 'critical' : 'concerning';
      immediateAttention.reasons.push(`${criticalConditions.length} critical medical conditions active`);
    }

    return immediateAttention;
  }

  /**
   * Generate comprehensive health report for a student
   * Includes data from all modules
   */
  async generateComprehensiveReport(studentId: string, options: {
    includeAllergies?: boolean;
    includeConditions?: boolean;
    includeVaccinations?: boolean;
    includeScreenings?: boolean;
    includeGrowth?: boolean;
    includeVitals?: boolean;
    dateFrom?: string;
    dateTo?: string;
    format?: 'pdf' | 'json';
  } = {}) {
    const {
      includeAllergies = true,
      includeConditions = true,
      includeVaccinations = true,
      includeScreenings = true,
      includeGrowth = true,
      includeVitals = true,
      format = 'pdf'
    } = options;

    const reportPromises = [];

    // Main health records report
    reportPromises.push(
      this.records.exportRecords(studentId, format)
    );

    // Additional module reports if requested
    if (includeVaccinations) {
      reportPromises.push(
        this.vaccinations.generateReport(studentId, format)
      );
    }

    if (includeScreenings) {
      reportPromises.push(
        this.screenings.generateReport(studentId, { 
          dateFrom: options.dateFrom,
          dateTo: options.dateTo,
          format 
        })
      );
    }

    if (includeGrowth) {
      reportPromises.push(
        this.growth.generateReport(studentId, { 
          dateFrom: options.dateFrom,
          dateTo: options.dateTo,
          format 
        })
      );
    }

    if (includeVitals) {
      reportPromises.push(
        this.vitals.generateReport(studentId, { 
          dateFrom: options.dateFrom,
          dateTo: options.dateTo,
          format 
        })
      );
    }

    const reports = await Promise.all(reportPromises);

    // If JSON format, combine all data
    if (format === 'json') {
      const combinedData = {
        studentId,
        generatedAt: new Date().toISOString(),
        reports: {
          healthRecords: reports[0],
          vaccinations: includeVaccinations ? reports[1] : null,
          screenings: includeScreenings ? reports[includeVaccinations ? 2 : 1] : null,
          growth: includeGrowth ? reports[includeVaccinations && includeScreenings ? 3 : includeVaccinations || includeScreenings ? 2 : 1] : null,
          vitals: includeVitals ? reports[reports.length - 1] : null
        }
      };

      return new Blob([JSON.stringify(combinedData, null, 2)], { 
        type: 'application/json' 
      });
    }

    // For PDF format, return the main report (additional reports would need to be combined server-side)
    return reports[0];
  }
}

// ==========================================
// DEFAULT EXPORT & FACTORY FUNCTIONS
// ==========================================

/**
 * Factory function to create HealthRecordsApi instance
 */
export function createHealthRecordsApi(client: ApiClient): HealthRecordsApi {
  return new HealthRecordsApi(client);
}

/**
 * Default export for backward compatibility
 */
export default HealthRecordsApi;

// ==========================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// ==========================================

/**
 * Legacy export names to maintain backward compatibility
 * with existing code that might be using the old API
 */
export const HealthRecordsLegacyService = HealthRecordsApi;
export const createHealthRecordsLegacyService = createHealthRecordsApi;

// Alias for the main class
export { HealthRecordsApi as HealthRecords };
