/**
 * AuditStats Component
 *
 * Displays aggregate statistics for compliance audits including
 * total audits, in-progress count, open findings, and average score.
 *
 * @module ComplianceAudit/AuditStats
 */

'use client';

import React, { useMemo } from 'react';
import {
  FileSearch,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import type { ComplianceAudit, AuditStatistics } from './types';

/**
 * Props for the AuditStats component
 */
export interface AuditStatsProps {
  /** Array of audits to calculate statistics from */
  audits: ComplianceAudit[];
}

/**
 * Calculates aggregate statistics from audit data
 *
 * @param audits - Array of compliance audits
 * @returns Calculated statistics
 */
const calculateStats = (audits: ComplianceAudit[]): AuditStatistics => {
  const stats: AuditStatistics = {
    total: audits.length,
    scheduled: audits.filter(a => a.status === 'scheduled').length,
    inProgress: audits.filter(a => a.status === 'in-progress').length,
    completed: audits.filter(a => a.status === 'completed').length,
    overdue: audits.filter(a => a.status === 'overdue').length,
    totalFindings: audits.reduce((acc, audit) => acc + audit.findings.length, 0),
    openFindings: audits.reduce((acc, audit) =>
      acc + audit.findings.filter(f => f.status === 'open').length, 0),
    avgScore: 0
  };

  // Calculate average score from completed audits with scores
  const auditsWithScores = audits.filter(a => a.score !== undefined);
  if (auditsWithScores.length > 0) {
    const totalScore = auditsWithScores.reduce((acc, a) => acc + (a.score || 0), 0);
    stats.avgScore = Math.round(totalScore / auditsWithScores.length);
  }

  return stats;
};

/**
 * AuditStats Component
 *
 * Displays a row of statistic cards showing key metrics about audits.
 * Automatically calculates statistics from the provided audit data.
 *
 * @param props - AuditStats component props
 * @returns JSX element representing the statistics cards
 */
export const AuditStats: React.FC<AuditStatsProps> = ({ audits }) => {
  const stats = useMemo(() => calculateStats(audits), [audits]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Audits */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Audits</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <FileSearch className="w-8 h-8 text-gray-400" />
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-400" />
        </div>
      </div>

      {/* Open Findings */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Open Findings</p>
            <p className="text-2xl font-bold text-red-600">{stats.openFindings}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
      </div>

      {/* Average Score */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Score</p>
            <p className="text-2xl font-bold text-green-600">{stats.avgScore}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>
      </div>
    </div>
  );
};

export default AuditStats;
