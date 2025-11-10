/**
 * LOC: USACE-DOWNSTREAM-CLT-001
 * File: /reuse/frontend/composites/usace/downstream/contract-lifecycle-tracking.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/composites/usace/usace-contract-management-composites.ts
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE contract tracking systems
 *   - Project management dashboards
 *   - Reporting applications
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/contract-lifecycle-tracking.ts
 * Locator: WC-USACE-DS-CLT-001
 * Purpose: Contract Lifecycle Tracking - Complete contract status and timeline monitoring
 *
 * Upstream: usace-contract-management-composites.ts, React 18+, Next.js 16+
 * Downstream: USACE project managers, contract administrators, district offices
 * Dependencies: React 18+, TypeScript 5.x, parent composite
 * Exports: 6 lifecycle tracking and visualization components
 *
 * LLM Context: Production-ready contract lifecycle tracking system for USACE.
 * Provides comprehensive contract status monitoring, timeline visualization, milestone tracking,
 * performance trending, and lifecycle analytics. Designed for real-time contract oversight
 * with automated alerts and predictive analytics for schedule and budget compliance.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useContractManagement,
  useContractModifications,
  calculateContractMetrics,
  calculateDaysToExpiration,
  type Contract,
  type ContractStatus,
} from '../usace-contract-management-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ContractMilestone {
  id: string;
  contractId: string;
  milestoneName: string;
  plannedDate: Date;
  actualDate?: Date;
  status: 'upcoming' | 'on_track' | 'at_risk' | 'late' | 'completed';
  description: string;
  deliverables?: string[];
}

export interface ContractTimeline {
  contractId: string;
  phases: TimelinePhase[];
  criticalPath: string[];
  overallProgress: number;
}

export interface TimelinePhase {
  id: string;
  phaseName: string;
  startDate: Date;
  endDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  milestones: ContractMilestone[];
}

export interface LifecycleAlert {
  id: string;
  contractId: string;
  alertType: 'expiring_soon' | 'overdue_milestone' | 'funding_issue' | 'performance_concern';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  actionRequired: string;
  createdDate: Date;
  dismissed: boolean;
}

// ============================================================================
// CONTRACT LIFECYCLE TIMELINE
// ============================================================================

/**
 * Visual contract lifecycle timeline with milestone tracking
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Lifecycle timeline
 *
 * @example
 * ```tsx
 * <ContractLifecycleTimeline
 *   contractId="CONTRACT-001"
 *   onMilestoneClick={(milestone) => handleMilestone(milestone)}
 * />
 * ```
 */
export function ContractLifecycleTimeline({
  contractId,
  contract,
  onMilestoneClick,
}: {
  contractId: string;
  contract?: Contract;
  onMilestoneClick?: (milestone: ContractMilestone) => void;
}) {
  const [milestones, setMilestones] = useState<ContractMilestone[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const timelinePhases = useMemo<TimelinePhase[]>(() => {
    if (!contract) return [];

    const phases: TimelinePhase[] = [
      {
        id: 'pre-award',
        phaseName: 'Pre-Award',
        startDate: new Date(contract.performancePeriod.start.getTime() - 90 * 24 * 60 * 60 * 1000),
        endDate: contract.awardDate || contract.performancePeriod.start,
        status: 'completed',
        progress: 100,
        milestones: [],
      },
      {
        id: 'award',
        phaseName: 'Award',
        startDate: contract.awardDate || contract.performancePeriod.start,
        endDate: contract.effectiveDate || contract.performancePeriod.start,
        status: 'completed',
        progress: 100,
        milestones: [],
      },
      {
        id: 'performance',
        phaseName: 'Performance Period',
        startDate: contract.performancePeriod.start,
        endDate: contract.performancePeriod.end,
        status: contract.status === 'active' ? 'in_progress' : 'completed',
        progress: calculateContractMetrics(contract).timeProgress,
        milestones: milestones.filter(m => {
          const mDate = new Date(m.plannedDate);
          return mDate >= contract.performancePeriod.start && mDate <= contract.performancePeriod.end;
        }),
      },
      {
        id: 'closeout',
        phaseName: 'Closeout',
        startDate: contract.completionDate || contract.performancePeriod.end,
        endDate: contract.closeoutDate || new Date(contract.performancePeriod.end.getTime() + 180 * 24 * 60 * 60 * 1000),
        status: contract.status === 'closed' ? 'completed' : 'not_started',
        progress: contract.status === 'closed' ? 100 : 0,
        milestones: [],
      },
    ];

    return phases;
  }, [contract, milestones]);

  const overallProgress = useMemo(() => {
    if (!contract) return 0;
    const metrics = calculateContractMetrics(contract);
    return metrics.timeProgress;
  }, [contract]);

  useEffect(() => {
    if (!contract) return;

    // Generate default milestones based on contract
    const defaultMilestones: ContractMilestone[] = [
      {
        id: '1',
        contractId: contract.id,
        milestoneName: 'Contract Award',
        plannedDate: contract.awardDate || contract.performancePeriod.start,
        actualDate: contract.awardDate,
        status: 'completed',
        description: 'Contract officially awarded to contractor',
      },
      {
        id: '2',
        contractId: contract.id,
        milestoneName: 'Performance Start',
        plannedDate: contract.performancePeriod.start,
        actualDate: contract.effectiveDate,
        status: 'completed',
        description: 'Begin contract performance period',
      },
      {
        id: '3',
        contractId: contract.id,
        milestoneName: 'Mid-Point Review',
        plannedDate: new Date((contract.performancePeriod.start.getTime() + contract.performancePeriod.end.getTime()) / 2),
        status: new Date() > new Date((contract.performancePeriod.start.getTime() + contract.performancePeriod.end.getTime()) / 2) ? 'completed' : 'upcoming',
        description: 'Mid-contract performance review',
      },
      {
        id: '4',
        contractId: contract.id,
        milestoneName: 'Performance End',
        plannedDate: contract.performancePeriod.end,
        actualDate: contract.completionDate,
        status: contract.completionDate ? 'completed' : 'upcoming',
        description: 'Complete contract performance',
      },
      {
        id: '5',
        contractId: contract.id,
        milestoneName: 'Contract Closeout',
        plannedDate: contract.closeoutDate || new Date(contract.performancePeriod.end.getTime() + 180 * 24 * 60 * 60 * 1000),
        actualDate: contract.closeoutDate,
        status: contract.status === 'closed' ? 'completed' : 'upcoming',
        description: 'Final contract closeout',
      },
    ];

    setMilestones(defaultMilestones);
  }, [contract]);

  if (!contract) {
    return <div className="p-4">Loading contract timeline...</div>;
  }

  return (
    <div className="contract-lifecycle-timeline p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Contract Lifecycle Timeline</h2>
        <p className="text-gray-600">
          {contract.contractNumber} - {contract.title}
        </p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-medium">{overallProgress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Timeline Phases */}
      <div className="space-y-6">
        {timelinePhases.map((phase, index) => (
          <div
            key={phase.id}
            className={`border-l-4 pl-6 ${
              phase.status === 'completed' ? 'border-green-500' :
              phase.status === 'in_progress' ? 'border-blue-500' :
              phase.status === 'delayed' ? 'border-red-500' :
              'border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold">{phase.phaseName}</h3>
                <p className="text-sm text-gray-600">
                  {phase.startDate.toLocaleDateString()} - {phase.endDate.toLocaleDateString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded text-sm font-medium ${
                phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                phase.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                phase.status === 'delayed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {phase.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            {phase.status !== 'not_started' && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Phase Progress</span>
                  <span>{phase.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      phase.status === 'completed' ? 'bg-green-500' :
                      phase.status === 'in_progress' ? 'bg-blue-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Milestones in this phase */}
            {phase.milestones.length > 0 && (
              <div className="mt-4 space-y-2">
                {phase.milestones.map(milestone => (
                  <div
                    key={milestone.id}
                    onClick={() => onMilestoneClick && onMilestoneClick(milestone)}
                    className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'late' ? 'bg-red-500' :
                          milestone.status === 'at_risk' ? 'bg-orange-500' :
                          'bg-gray-300'
                        }`} />
                        <span className="font-medium">{milestone.milestoneName}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {milestone.plannedDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Milestones List */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">All Milestones</h3>
        <div className="space-y-2">
          {milestones.map(milestone => (
            <div
              key={milestone.id}
              onClick={() => onMilestoneClick && onMilestoneClick(milestone)}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center flex-1">
                <div className={`w-4 h-4 rounded-full mr-3 ${
                  milestone.status === 'completed' ? 'bg-green-500' :
                  milestone.status === 'late' ? 'bg-red-500' :
                  milestone.status === 'at_risk' ? 'bg-orange-500' :
                  milestone.status === 'on_track' ? 'bg-blue-500' :
                  'bg-gray-300'
                }`} />
                <div>
                  <div className="font-medium">{milestone.milestoneName}</div>
                  <div className="text-sm text-gray-600">{milestone.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {milestone.plannedDate.toLocaleDateString()}
                </div>
                {milestone.actualDate && (
                  <div className="text-xs text-gray-600">
                    Actual: {milestone.actualDate.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Contract lifecycle alerts and notifications
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Lifecycle alerts
 *
 * @example
 * ```tsx
 * <ContractLifecycleAlerts
 *   contracts={allContracts}
 *   onAlertAction={(alert) => handleAlert(alert)}
 * />
 * ```
 */
export function ContractLifecycleAlerts({
  contracts,
  onAlertAction,
}: {
  contracts: Contract[];
  onAlertAction?: (alert: LifecycleAlert) => void;
}) {
  const [alerts, setAlerts] = useState<LifecycleAlert[]>([]);

  useEffect(() => {
    const generatedAlerts: LifecycleAlert[] = [];

    contracts.forEach(contract => {
      const daysToExpiration = calculateDaysToExpiration(contract);
      const metrics = calculateContractMetrics(contract);

      // Expiring soon alert
      if (daysToExpiration > 0 && daysToExpiration <= 90) {
        generatedAlerts.push({
          id: crypto.randomUUID(),
          contractId: contract.id,
          alertType: 'expiring_soon',
          severity: daysToExpiration <= 30 ? 'critical' : 'warning',
          message: `Contract ${contract.contractNumber} expires in ${daysToExpiration} days`,
          actionRequired: 'Review contract for potential extension or closeout',
          createdDate: new Date(),
          dismissed: false,
        });
      }

      // Performance concern alert
      if (metrics.variance < -15) {
        generatedAlerts.push({
          id: crypto.randomUUID(),
          contractId: contract.id,
          alertType: 'performance_concern',
          severity: 'warning',
          message: `Contract ${contract.contractNumber} cost performance is ${Math.abs(metrics.variance)}% behind schedule`,
          actionRequired: 'Review cost expenditure and project schedule',
          createdDate: new Date(),
          dismissed: false,
        });
      }

      // Funding issue alert
      if (contract.fundingUtilization && metrics.fundingUtilization > 90) {
        generatedAlerts.push({
          id: crypto.randomUUID(),
          contractId: contract.id,
          alertType: 'funding_issue',
          severity: metrics.fundingUtilization > 95 ? 'critical' : 'warning',
          message: `Contract ${contract.contractNumber} has used ${metrics.fundingUtilization}% of available funding`,
          actionRequired: 'Review remaining funding and consider additional obligation',
          createdDate: new Date(),
          dismissed: false,
        });
      }
    });

    setAlerts(generatedAlerts);
  }, [contracts]);

  const criticalAlerts = useMemo(() => alerts.filter(a => a.severity === 'critical' && !a.dismissed), [alerts]);
  const warningAlerts = useMemo(() => alerts.filter(a => a.severity === 'warning' && !a.dismissed), [alerts]);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  }, []);

  return (
    <div className="contract-lifecycle-alerts p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Lifecycle Alerts</h2>
        <p className="text-gray-600">
          Active alerts: {alerts.filter(a => !a.dismissed).length}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Critical Alerts</div>
          <div className="text-3xl font-bold text-red-600">{criticalAlerts.length}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Warning Alerts</div>
          <div className="text-3xl font-bold text-yellow-600">{warningAlerts.length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.filter(a => !a.dismissed).map(alert => {
          const contract = contracts.find(c => c.id === alert.contractId);

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.alertType.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="font-bold text-lg">{alert.message}</div>
                  {contract && (
                    <div className="text-sm text-gray-600 mt-1">
                      Contract: {contract.contractNumber} - {contract.title}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm text-gray-700 mb-3">
                <span className="font-medium">Action Required:</span> {alert.actionRequired}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {alert.createdDate.toLocaleString()}
                </div>
                <button
                  onClick={() => onAlertAction && onAlertAction(alert)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Take Action →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {alerts.filter(a => !a.dismissed).length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">✓</div>
          <div className="text-lg">No active alerts</div>
          <div className="text-sm">All contracts are on track</div>
        </div>
      )}
    </div>
  );
}

/**
 * Contract lifecycle analytics dashboard
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Lifecycle analytics
 *
 * @example
 * ```tsx
 * <ContractLifecycleAnalytics
 *   contracts={allContracts}
 *   timeframe="quarterly"
 * />
 * ```
 */
export function ContractLifecycleAnalytics({
  contracts,
  timeframe = 'monthly',
}: {
  contracts: Contract[];
  timeframe?: 'monthly' | 'quarterly' | 'annual';
}) {
  const analytics = useMemo(() => {
    const byStatus: Record<ContractStatus, number> = {} as Record<ContractStatus, number>;
    let totalValue = 0;
    let onTimeCount = 0;
    let delayedCount = 0;
    let avgPerformance = 0;

    contracts.forEach(contract => {
      byStatus[contract.status] = (byStatus[contract.status] || 0) + 1;
      totalValue += contract.currentValue;

      const metrics = calculateContractMetrics(contract);
      avgPerformance += metrics.timeProgress;

      if (metrics.variance >= -5) {
        onTimeCount++;
      } else {
        delayedCount++;
      }
    });

    avgPerformance = contracts.length > 0 ? avgPerformance / contracts.length : 0;

    return {
      totalContracts: contracts.length,
      totalValue,
      byStatus,
      onTimeCount,
      delayedCount,
      onTimePercentage: contracts.length > 0 ? (onTimeCount / contracts.length) * 100 : 0,
      avgPerformance,
    };
  }, [contracts]);

  return (
    <div className="contract-lifecycle-analytics p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Lifecycle Analytics</h2>
        <p className="text-gray-600">Timeframe: {timeframe}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Contracts</div>
          <div className="text-3xl font-bold">{analytics.totalContracts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Value</div>
          <div className="text-3xl font-bold">${(analytics.totalValue / 1000000).toFixed(1)}M</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">On-Time Performance</div>
          <div className="text-3xl font-bold text-green-600">
            {analytics.onTimePercentage.toFixed(0)}%
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Avg Progress</div>
          <div className="text-3xl font-bold text-blue-600">
            {analytics.avgPerformance.toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Contracts by Status</h3>
        <div className="space-y-3">
          {Object.entries(analytics.byStatus).map(([status, count]) => {
            const percentage = (count / analytics.totalContracts) * 100;

            return (
              <div key={status}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium capitalize">
                    {status.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Performance Trends</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">On-Time Contracts</div>
            <div className="text-3xl font-bold text-green-600">{analytics.onTimeCount}</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-gray-600">Delayed Contracts</div>
            <div className="text-3xl font-bold text-red-600">{analytics.delayedCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  ContractLifecycleTimeline,
  ContractLifecycleAlerts,
  ContractLifecycleAnalytics,
};
