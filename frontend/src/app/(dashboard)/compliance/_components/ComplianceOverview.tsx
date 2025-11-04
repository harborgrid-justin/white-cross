/**
 * @fileoverview Compliance Overview Component - Statistics dashboard cards
 * @module app/(dashboard)/compliance/_components/ComplianceOverview
 * @category Compliance - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import type { ComplianceOverviewProps } from './compliance.types';

/**
 * Compliance statistics overview component
 * Displays key metrics in card layout with icons and progress indicators
 *
 * @param stats - Compliance statistics data
 * @param loading - Optional loading state for skeleton display
 */
export function ComplianceOverview({ stats, loading = false }: ComplianceOverviewProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Compliant Requirements Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg" aria-hidden="true">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliant</p>
              <p className="text-2xl font-bold text-gray-900" aria-label={`${stats.compliantCount} compliant requirements`}>
                {stats.compliantCount}
              </p>
              <p className="text-xs text-gray-500">
                {((stats.compliantCount / stats.totalRequirements) * 100).toFixed(1)}% of requirements
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Non-Compliant Requirements Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg" aria-hidden="true">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
              <p className="text-2xl font-bold text-gray-900" aria-label={`${stats.nonCompliantCount} non-compliant requirements`}>
                {stats.nonCompliantCount}
              </p>
              <p className="text-xs text-gray-500">
                {stats.overdueTasks} overdue task{stats.overdueTasks !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Needs Attention Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg" aria-hidden="true">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Needs Attention</p>
              <p className="text-2xl font-bold text-gray-900" aria-label={`${stats.needsAttentionCount} requirements need attention`}>
                {stats.needsAttentionCount}
              </p>
              <p className="text-xs text-gray-500">
                Requires review
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Compliance Rate Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg" aria-hidden="true">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-gray-900" aria-label={`${stats.complianceRate} percent compliance rate`}>
                {stats.complianceRate}%
              </p>
              <p className="text-xs text-gray-500">
                Risk score: {stats.riskScore}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
