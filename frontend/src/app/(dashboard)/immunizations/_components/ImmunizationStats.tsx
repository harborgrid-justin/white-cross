/**
 * @fileoverview Immunization Statistics Display Component
 * @module app/immunizations/components
 *
 * Displays key immunization statistics and compliance metrics in card format.
 * Shows compliance rate, upcoming due dates, overdue count, and scheduled immunizations.
 */

'use client';

import React from 'react';
import { Shield, Calendar, AlertTriangle, Syringe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ImmunizationStats } from './types/immunization.types';

interface ImmunizationStatsProps {
  stats: ImmunizationStats;
}

/**
 * ImmunizationStats component
 * Renders four stat cards showing compliance and scheduling information
 */
export const ImmunizationStatsComponent: React.FC<ImmunizationStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Compliance Rate Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.complianceRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.upToDate} of {stats.totalStudents} students
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-500" aria-hidden="true" />
          </div>
        </div>
      </Card>

      {/* Due This Week Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due This Week</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.dueThisWeek}</p>
              <p className="text-xs text-gray-500 mt-1">Scheduled immunizations</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" aria-hidden="true" />
          </div>
        </div>
      </Card>

      {/* Overdue Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</p>
              <p className="text-xs text-gray-500 mt-1">Require immediate attention</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
          </div>
        </div>
      </Card>

      {/* Scheduled Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.scheduled}</p>
              <p className="text-xs text-gray-500 mt-1">Upcoming immunizations</p>
            </div>
            <Syringe className="h-8 w-8 text-blue-500" aria-hidden="true" />
          </div>
        </div>
      </Card>
    </div>
  );
};
