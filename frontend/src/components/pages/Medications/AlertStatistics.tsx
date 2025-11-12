/**
 * AlertStatistics Component
 *
 * Displays statistics cards showing alert counts by category:
 * - Total alerts
 * - Unacknowledged alerts
 * - Critical alerts
 * - Alerts requiring action
 */

import React from 'react';
import type { AlertStatisticsProps } from './medicationAlerts.types';

/**
 * AlertStatistics component displays key metrics about medication alerts
 *
 * @param props - Component props
 * @returns JSX element with statistics cards
 */
export function AlertStatistics({ stats }: AlertStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Alerts Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-10a2 2 0 00-2-2H5a2 2 0 00-2 2v10h3" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Alerts</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Unacknowledged Alerts Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Unacknowledged</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.unacknowledged}</p>
          </div>
        </div>
      </div>

      {/* Critical Alerts Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Critical</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.critical}</p>
          </div>
        </div>
      </div>

      {/* Action Required Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Action Required</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.actionRequired}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertStatistics;
