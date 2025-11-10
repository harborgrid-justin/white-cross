/**
 * LOC: CERNER-CDS-ENGINE-DS-001
 * File: /reuse/server/health/composites/downstream/clinical-decision-support-engines.ts
 *
 * UPSTREAM (imports from):
 *   - ../cerner-clinical-integration-composites
 *   - ../../health-clinical-decision-support-kit
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - CDS rule engines
 *   - Alert management systems
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface CDSRule {
  ruleId: string;
  ruleName: string;
  ruleType: 'alert' | 'reminder' | 'guideline' | 'order_set';
  conditions: Array<{ field: string; operator: string; value: any }>;
  actions: Array<{ actionType: string; actionData: any }>;
  priority: number;
  enabled: boolean;
}

export interface CDSRuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  triggered: boolean;
  actions: any[];
  evaluatedAt: Date;
}

@Injectable()
export class ClinicalDecisionSupportEnginesService {
  private readonly logger = new Logger(ClinicalDecisionSupportEnginesService.name);

  /**
   * Evaluate CDS rules against patient data
   * Runs clinical decision support rules and triggers appropriate actions
   */
  async evaluateCDSRules(
    patientData: {
      age: number;
      gender: string;
      conditions: string[];
      medications: string[];
      labResults: any[];
      vitals: any;
    },
    encounterContext: {
      encounterId: string;
      encounterType: string;
      providerId: string;
    }
  ): Promise<CDSRuleEvaluationResult[]> {
    this.logger.log(`Evaluating CDS rules for encounter ${encounterContext.encounterId}`);

    try {
      // Fetch active CDS rules
      const activeRules = await this.getActiveCDSRules();

      const results: CDSRuleEvaluationResult[] = [];

      for (const rule of activeRules) {
        const triggered = this.evaluateRuleConditions(rule, patientData);

        if (triggered) {
          const actions = await this.executeRuleActions(rule, patientData, encounterContext);

          results.push({
            ruleId: rule.ruleId,
            ruleName: rule.ruleName,
            triggered: true,
            actions,
            evaluatedAt: new Date(),
          });
        }
      }

      this.logger.log(`CDS evaluation complete: ${results.length} rules triggered`);
      return results;
    } catch (error) {
      this.logger.error(`CDS rule evaluation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Manage CDS alert fatigue
   * Suppresses redundant alerts and prioritizes critical alerts
   */
  async manageCDSAlertFatigue(
    alerts: any[],
    providerId: string
  ): Promise<{ filteredAlerts: any[]; suppressedCount: number }> {
    this.logger.log(`Managing alert fatigue for provider ${providerId}: ${alerts.length} alerts`);

    try {
      const recentAlerts = await this.getRecentAlerts(providerId, 24); // Last 24 hours

      const filteredAlerts = alerts.filter(alert => {
        // Suppress duplicate alerts shown in last 24 hours
        const isDuplicate = recentAlerts.some(
          recent => recent.ruleId === alert.ruleId && recent.patientId === alert.patientId
        );

        // Always show critical severity alerts
        if (alert.severity === 'critical') return true;

        return !isDuplicate;
      });

      const suppressedCount = alerts.length - filteredAlerts.length;

      this.logger.log(`Alert fatigue management: ${suppressedCount} alerts suppressed`);
      return { filteredAlerts, suppressedCount };
    } catch (error) {
      this.logger.error(`Alert fatigue management failed: ${error.message}`);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async getActiveCDSRules(): Promise<CDSRule[]> {
    return [
      {
        ruleId: 'RULE-001',
        ruleName: 'Elderly patient high-risk medication alert',
        ruleType: 'alert',
        conditions: [
          { field: 'age', operator: '>=', value: 65 },
          { field: 'medications', operator: 'contains', value: 'diphenhydramine' },
        ],
        actions: [
          { actionType: 'show_alert', actionData: { message: 'Beers Criteria: Avoid diphenhydramine in elderly' } },
        ],
        priority: 2,
        enabled: true,
      },
    ];
  }

  private evaluateRuleConditions(rule: CDSRule, patientData: any): boolean {
    return rule.conditions.every(condition => {
      const value = patientData[condition.field];

      switch (condition.operator) {
        case '>=':
          return value >= condition.value;
        case 'contains':
          return Array.isArray(value) && value.some(v => v.toLowerCase().includes(condition.value.toLowerCase()));
        default:
          return false;
      }
    });
  }

  private async executeRuleActions(rule: CDSRule, patientData: any, encounterContext: any): Promise<any[]> {
    return rule.actions.map(action => ({
      actionType: action.actionType,
      executed: true,
      ...action.actionData,
    }));
  }

  private async getRecentAlerts(providerId: string, hoursBack: number): Promise<any[]> {
    return [];
  }
}

export default ClinicalDecisionSupportEnginesService;
