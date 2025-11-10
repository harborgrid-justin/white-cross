/**
 * LOC: CERNER-TRACKBOARD-DS-001
 * File: /reuse/server/health/composites/downstream/track-board-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../cerner-emergency-dept-composites
 *   - ../../health-emergency-department-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - ED track board UI
 *   - Real-time monitoring dashboards
 *   - WebSocket services for live updates
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  CernerEmergencyDeptCompositeService,
  EDTrackBoardEntry,
} from '../cerner-emergency-dept-composites';

export interface EnhancedTrackBoardEntry extends EDTrackBoardEntry {
  timeSinceArrival: number; // minutes
  timeSinceLastUpdate: number; // minutes
  waitTime: number; // minutes
  assignedProvider?: string;
  assignedNurse?: string;
  bedType?: string;
  isolationStatus: boolean;
  pendingOrders: number;
  pendingResults: number;
  alerts: Array<{ type: string; message: string; severity: string }>;
}

@Injectable()
export class TrackBoardServicesService {
  private readonly logger = new Logger(TrackBoardServicesService.name);

  constructor(
    private readonly edComposite: CernerEmergencyDeptCompositeService
  ) {}

  /**
   * Get enhanced real-time track board
   * Provides comprehensive track board with calculated metrics and alerts
   */
  async getEnhancedRealtimeTrackBoard(): Promise<{
    entries: EnhancedTrackBoardEntry[];
    summary: {
      totalPatients: number;
      byStatus: Record<string, number>;
      byESI: Record<number, number>;
      averageWaitTime: number;
      longestWaitTime: number;
      criticalAlerts: number;
    };
  }> {
    this.logger.log('Retrieving enhanced ED track board');

    try {
      // Get base track board entries
      const baseEntries = await this.edComposite.getRealtimeEDTrackBoard();

      // Enhance each entry with additional data
      const enhancedEntries: EnhancedTrackBoardEntry[] = await Promise.all(
        baseEntries.map(async entry => {
          const now = new Date();
          const timeSinceArrival = Math.floor((now.getTime() - entry.arrivedAt.getTime()) / 60000);

          // Get patient details
          const patientDetails = await this.getPatientDetails(entry.registrationId);

          // Calculate alerts
          const alerts = this.calculatePatientAlerts(entry, timeSinceArrival, patientDetails);

          return {
            ...entry,
            timeSinceArrival,
            timeSinceLastUpdate: 5, // minutes since last status update
            waitTime: entry.status === 'waiting' ? timeSinceArrival : 0,
            assignedProvider: patientDetails.assignedProvider,
            assignedNurse: patientDetails.assignedNurse,
            bedType: patientDetails.bedType,
            isolationStatus: patientDetails.isolationRequired,
            pendingOrders: patientDetails.pendingOrders,
            pendingResults: patientDetails.pendingResults,
            alerts,
          };
        })
      );

      // Calculate summary
      const summary = this.calculateTrackBoardSummary(enhancedEntries);

      this.logger.log(`Track board loaded: ${enhancedEntries.length} patients, ${summary.criticalAlerts} alerts`);

      return {
        entries: enhancedEntries,
        summary,
      };
    } catch (error) {
      this.logger.error(`Enhanced track board retrieval failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Monitor track board for critical conditions
   * Identifies patients requiring immediate attention
   */
  async monitorTrackBoardForCriticalConditions(): Promise<{
    criticalPatients: Array<{
      registrationId: string;
      patientName: string;
      esiLevel: number;
      condition: string;
      timeSinceArrival: number;
      recommendedAction: string;
    }>;
  }> {
    this.logger.log('Monitoring track board for critical conditions');

    try {
      const trackBoard = await this.getEnhancedRealtimeTrackBoard();

      const criticalPatients = trackBoard.entries
        .filter(entry => {
          // ESI 1-2 waiting > 10 minutes
          if ((entry.esiLevel === 1 || entry.esiLevel === 2) && entry.waitTime > 10) {
            return true;
          }
          // Any patient waiting > 120 minutes
          if (entry.waitTime > 120) {
            return true;
          }
          // Critical alerts
          if (entry.alerts.some(a => a.severity === 'critical')) {
            return true;
          }
          return false;
        })
        .map(entry => ({
          registrationId: entry.registrationId,
          patientName: entry.patientName,
          esiLevel: entry.esiLevel,
          condition: this.determineCriticalCondition(entry),
          timeSinceArrival: entry.timeSinceArrival,
          recommendedAction: this.recommendAction(entry),
        }));

      this.logger.log(`Critical condition monitoring: ${criticalPatients.length} patients require attention`);

      return { criticalPatients };
    } catch (error) {
      this.logger.error(`Critical condition monitoring failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update track board entry status
   * Updates patient status and location on track board
   */
  async updateTrackBoardEntryStatus(
    registrationId: string,
    newStatus: string,
    newLocation: string,
    updatedBy: string
  ): Promise<{ updated: boolean; timestamp: Date }> {
    this.logger.log(`Updating track board for ${registrationId}: ${newStatus}`);

    try {
      await this.edComposite.updatePatientEDStatus(registrationId, newStatus, newLocation);

      // Trigger real-time update broadcast
      await this.broadcastTrackBoardUpdate(registrationId);

      return {
        updated: true,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Track board update failed: ${error.message}`);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async getPatientDetails(registrationId: string): Promise<any> {
    return {
      assignedProvider: 'Dr. Smith',
      assignedNurse: 'RN Johnson',
      bedType: 'Acute',
      isolationRequired: false,
      pendingOrders: 3,
      pendingResults: 2,
    };
  }

  private calculatePatientAlerts(entry: any, timeSinceArrival: number, details: any): any[] {
    const alerts = [];

    // High-acuity long wait alert
    if ((entry.esiLevel === 1 || entry.esiLevel === 2) && timeSinceArrival > 15) {
      alerts.push({
        type: 'long_wait',
        message: `High-acuity patient waiting ${timeSinceArrival} minutes`,
        severity: 'critical',
      });
    }

    // Pending critical results
    if (details.pendingResults > 0) {
      alerts.push({
        type: 'pending_results',
        message: `${details.pendingResults} pending results`,
        severity: 'warning',
      });
    }

    return alerts;
  }

  private calculateTrackBoardSummary(entries: EnhancedTrackBoardEntry[]): any {
    const totalPatients = entries.length;

    const byStatus = entries.reduce((acc, entry) => {
      acc[entry.status] = (acc[entry.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byESI = entries.reduce((acc, entry) => {
      acc[entry.esiLevel] = (acc[entry.esiLevel] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const waitTimes = entries.map(e => e.waitTime).filter(w => w > 0);
    const averageWaitTime = waitTimes.length > 0 ? waitTimes.reduce((sum, w) => sum + w, 0) / waitTimes.length : 0;
    const longestWaitTime = waitTimes.length > 0 ? Math.max(...waitTimes) : 0;

    const criticalAlerts = entries.reduce((count, entry) => {
      return count + entry.alerts.filter(a => a.severity === 'critical').length;
    }, 0);

    return {
      totalPatients,
      byStatus,
      byESI,
      averageWaitTime: Math.round(averageWaitTime),
      longestWaitTime,
      criticalAlerts,
    };
  }

  private determineCriticalCondition(entry: EnhancedTrackBoardEntry): string {
    if (entry.esiLevel === 1) return 'Immediate life threat';
    if (entry.esiLevel === 2) return 'High-risk condition';
    if (entry.waitTime > 120) return 'Prolonged wait time';
    return 'Requires attention';
  }

  private recommendAction(entry: EnhancedTrackBoardEntry): string {
    if (entry.esiLevel === 1 || entry.esiLevel === 2) {
      return 'Immediate provider assessment required';
    }
    if (entry.waitTime > 120) {
      return 'Reassess triage level and provide update';
    }
    return 'Monitor closely';
  }

  private async broadcastTrackBoardUpdate(registrationId: string): Promise<void> {
    // Broadcast via WebSocket or Server-Sent Events
    this.logger.log(`Broadcasting track board update for ${registrationId}`);
  }
}

export default TrackBoardServicesService;
