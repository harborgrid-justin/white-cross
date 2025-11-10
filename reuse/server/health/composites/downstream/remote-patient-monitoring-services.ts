/**
 * LOC: EPIC-RPM-DS-003
 * File: /reuse/server/health/composites/downstream/remote-patient-monitoring-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../epic-telehealth-composites
 *   - ../health-clinical-workflows-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - RPM device integration APIs
 *   - Clinical monitoring dashboards
 */

/**
 * File: /reuse/server/health/composites/downstream/remote-patient-monitoring-services.ts
 * Locator: WC-RPM-DS-003
 * Purpose: Remote Patient Monitoring Services - RPM device integration and monitoring
 *
 * Upstream: epic-telehealth-composites, health-clinical-workflows-kit
 * Downstream: API controllers, monitoring dashboards
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common
 * Exports: Injectable service for RPM integration
 *
 * LLM Context: Production-grade RPM service integrating medical devices, processing vital signs,
 * generating alerts, managing CMS billing requirements, and orchestrating clinical interventions.
 */

import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
  orchestrateEpicRPMIntegration,
  EpicTelehealthContext,
  EpicRPMIntegration,
} from '../epic-telehealth-composites';

import {
  orchestrateClinicalAlertManagement,
  orchestrateClinicalTaskAssignment,
  AlertSeverity,
  TaskPriority,
} from '../health-clinical-workflows-kit';

@Injectable()
@ApiTags('Remote Patient Monitoring')
export class RemotePatientMonitoringService {
  private readonly logger = new Logger(RemotePatientMonitoringService.name);

  /**
   * Process RPM device data transmission
   * Integrates device readings into Epic EHR
   */
  @ApiOperation({ summary: 'Process RPM device data transmission' })
  @ApiResponse({ status: 200, description: 'Device data processed successfully' })
  async processDeviceDataTransmission(
    rpmData: {
      patientId: string;
      deviceType: 'blood_pressure' | 'glucose' | 'pulse_oximeter' | 'weight_scale';
      deviceSerialNumber: string;
      measurements: Array<{
        measurementType: string;
        value: number;
        unit: string;
        timestamp: Date;
      }>;
    },
    userId: string,
    organizationId: string,
    facilityId: string
  ): Promise<{
    rpmSessionId: string;
    measurementsProcessed: number;
    alertsGenerated: number;
    billingEligible: boolean;
  }> {
    this.logger.log(`Processing RPM data for patient ${rpmData.patientId}, device ${rpmData.deviceType}`);

    try {
      const context: EpicTelehealthContext = {
        userId,
        userRole: 'system',
        facilityId,
        organizationId,
        timestamp: new Date(),
      };

      // Process RPM data integration
      const rpmIntegration = await orchestrateEpicRPMIntegration(rpmData, context);

      // Analyze measurements for abnormalities
      const alerts = await this.analyzeAndGenerateAlerts(
        rpmData.patientId,
        rpmData.measurements,
        facilityId
      );

      this.logger.log(`RPM session ${rpmIntegration.rpmSessionId} created, ${alerts.length} alerts generated`);

      return {
        rpmSessionId: rpmIntegration.rpmSessionId,
        measurementsProcessed: rpmData.measurements.length,
        alertsGenerated: alerts.length,
        billingEligible: rpmIntegration.billingEligible,
      };
    } catch (error) {
      this.logger.error(`RPM data processing failed: ${error.message}`);
      throw new BadRequestException(`Failed to process RPM data: ${error.message}`);
    }
  }

  /**
   * Monitor RPM data for CMS billing compliance
   * Tracks 16 days of readings per month requirement
   */
  @ApiOperation({ summary: 'Monitor RPM billing compliance' })
  async monitorBillingCompliance(
    patientId: string,
    month: number,
    year: number,
    organizationId: string,
    facilityId: string
  ): Promise<{
    compliant: boolean;
    daysWithReadings: number;
    minutesTracked: number;
    billableCodes: string[];
    estimatedReimbursement: number;
  }> {
    this.logger.log(`Checking RPM billing compliance for patient ${patientId} - ${month}/${year}`);

    try {
      // Get RPM sessions for the month
      const sessions = await this.getRPMSessionsForMonth(patientId, month, year);

      // Calculate compliance
      const daysWithReadings = new Set(
        sessions.map(s => s.measurements.map(m => m.timestamp.toDateString())).flat()
      ).size;

      const minutesTracked = sessions.reduce((total, s) => total + s.minutesTracked, 0);
      const compliant = daysWithReadings >= 16;

      // Determine billable CPT codes
      const billableCodes: string[] = [];
      if (compliant) {
        billableCodes.push('99453'); // Initial device setup
        billableCodes.push('99454'); // Device supply with daily recordings
        if (minutesTracked >= 20) {
          billableCodes.push('99457'); // First 20 minutes of clinical staff time
        }
        if (minutesTracked >= 40) {
          billableCodes.push('99458'); // Additional 20 minutes
        }
      }

      // Estimate reimbursement
      const estimatedReimbursement = this.calculateRPMReimbursement(billableCodes);

      return {
        compliant,
        daysWithReadings,
        minutesTracked,
        billableCodes,
        estimatedReimbursement,
      };
    } catch (error) {
      this.logger.error(`RPM billing compliance check failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create RPM enrollment for patient
   */
  @ApiOperation({ summary: 'Create RPM enrollment for patient' })
  async enrollPatientInRPM(
    enrollmentData: {
      patientId: string;
      enrollingProviderId: string;
      conditions: string[];
      deviceTypes: string[];
      monitoringFrequency: string;
      targetParameters: Record<string, { min: number; max: number }>;
    },
    userId: string,
    organizationId: string,
    facilityId: string
  ): Promise<{
    enrollmentId: string;
    consentObtained: boolean;
    devicesOrdered: boolean;
    trainingScheduled: boolean;
  }> {
    this.logger.log(`Enrolling patient ${enrollmentData.patientId} in RPM program`);

    try {
      const enrollmentId = `RPM-ENROLL-${Date.now()}`;

      // Create enrollment record
      await this.createRPMEnrollment({
        enrollmentId,
        ...enrollmentData,
        enrollmentDate: new Date(),
        status: 'active',
      });

      // Order devices
      const devicesOrdered = await this.orderRPMDevices(
        enrollmentData.patientId,
        enrollmentData.deviceTypes
      );

      // Schedule patient training
      const trainingScheduled = await this.scheduleDeviceTraining(
        enrollmentData.patientId,
        enrollmentData.deviceTypes
      );

      return {
        enrollmentId,
        consentObtained: true,
        devicesOrdered,
        trainingScheduled,
      };
    } catch (error) {
      this.logger.error(`RPM enrollment failed: ${error.message}`);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async analyzeAndGenerateAlerts(
    patientId: string,
    measurements: any[],
    facilityId: string
  ): Promise<any[]> {
    const alerts: any[] = [];

    for (const measurement of measurements) {
      // Check for critical values
      let severity: AlertSeverity | null = null;
      let alertMessage = '';

      if (measurement.measurementType === 'blood_pressure_systolic' && measurement.value > 180) {
        severity = AlertSeverity.CRITICAL;
        alertMessage = `Critical BP systolic: ${measurement.value} mmHg`;
      } else if (measurement.measurementType === 'blood_pressure_systolic' && measurement.value > 140) {
        severity = AlertSeverity.HIGH;
        alertMessage = `Elevated BP systolic: ${measurement.value} mmHg`;
      } else if (measurement.measurementType === 'glucose' && measurement.value > 300) {
        severity = AlertSeverity.CRITICAL;
        alertMessage = `Critical glucose: ${measurement.value} mg/dL`;
      } else if (measurement.measurementType === 'oxygen_saturation' && measurement.value < 90) {
        severity = AlertSeverity.CRITICAL;
        alertMessage = `Critical SpO2: ${measurement.value}%`;
      }

      if (severity) {
        const alert = await orchestrateClinicalAlertManagement(
          {
            patientId,
            severity,
            type: 'vital_sign_alert',
            title: 'RPM Critical Value',
            message: alertMessage,
            assignedTo: 'rpm_team',
          },
          {
            patientId,
            encounterId: 'rpm-monitoring',
            providerId: 'rpm-system',
            facilityId,
            userId: 'rpm-system',
            userRole: 'system',
            timestamp: new Date(),
          }
        );
        alerts.push(alert);
      }
    }

    return alerts;
  }

  private async getRPMSessionsForMonth(
    patientId: string,
    month: number,
    year: number
  ): Promise<EpicRPMIntegration[]> {
    // Mock implementation - would query database
    return [];
  }

  private calculateRPMReimbursement(billableCodes: string[]): number {
    const reimbursementRates: Record<string, number> = {
      '99453': 19.19,
      '99454': 64.43,
      '99457': 50.18,
      '99458': 40.84,
    };

    return billableCodes.reduce((total, code) => total + (reimbursementRates[code] || 0), 0);
  }

  private async createRPMEnrollment(enrollment: any): Promise<void> {
    this.logger.log(`Creating RPM enrollment: ${enrollment.enrollmentId}`);
    // Implementation would persist to database
  }

  private async orderRPMDevices(patientId: string, deviceTypes: string[]): Promise<boolean> {
    this.logger.log(`Ordering ${deviceTypes.length} RPM devices for patient ${patientId}`);
    return true;
  }

  private async scheduleDeviceTraining(patientId: string, deviceTypes: string[]): Promise<boolean> {
    this.logger.log(`Scheduling device training for patient ${patientId}`);
    return true;
  }
}
