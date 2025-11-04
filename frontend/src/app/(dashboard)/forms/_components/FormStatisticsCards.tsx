/**
 * Form statistics cards component
 *
 * Displays aggregate statistics for all healthcare forms including
 * total forms, responses, completion rates, and critical forms count.
 */

import React from 'react';
import { FileText, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FormStats } from './types/formTypes';
import { formatCompletionRate } from './utils/formHelpers';

/**
 * Props for FormStatisticsCards component
 */
export interface FormStatisticsCardsProps {
  /** Aggregated form statistics */
  stats: FormStats;
}

/**
 * Displays statistics cards for forms overview
 *
 * @param props - Component props
 * @returns JSX element with statistics cards
 */
export const FormStatisticsCards: React.FC<FormStatisticsCardsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Total Forms Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Forms</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalForms}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.activeForms} active, {stats.draftForms} drafts
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </Card>

      {/* Total Responses Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Responses</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.totalResponses}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.todayResponses} today</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </Card>

      {/* Average Completion Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {formatCompletionRate(stats.averageCompletionRate)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Across all forms</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </Card>

      {/* Critical Forms Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Forms</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.criticalForms}</p>
              {stats.expiringSoon > 0 && (
                <p className="text-xs text-orange-600 mt-1">{stats.expiringSoon} expiring soon</p>
              )}
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </Card>
    </div>
  );
};
