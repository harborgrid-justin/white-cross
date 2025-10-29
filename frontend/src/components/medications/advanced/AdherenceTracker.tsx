'use client';

/**
 * Adherence Tracker Component
 * Track medication adherence rates and patterns
 */

import React from 'react';
import { Button } from '@/components/ui/Button';

export interface AdherenceData {
  medicationId: string;
  medicationName: string;
  studentName?: string;
  totalScheduled: number;
  totalGiven: number;
  totalMissed: number;
  totalRefused: number;
  adherenceRate: number;
  lastSevenDays: {
    date: string;
    scheduled: number;
    given: number;
    missed: number;
  }[];
}

export interface AdherenceTrackerProps {
  adherenceData: AdherenceData[];
  onViewDetails?: (medicationId: string) => void;
  showStudent?: boolean;
}

export const AdherenceTracker: React.FC<AdherenceTrackerProps> = ({
  adherenceData,
  onViewDetails,
  showStudent = false,
}) => {
  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (rate >= 75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getAdherenceStatus = (rate: number) => {
    if (rate >= 90) return 'Excellent';
    if (rate >= 75) return 'Good';
    if (rate >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adherenceData.map((data) => (
          <div key={data.medicationId} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{data.medicationName}</h3>
              {showStudent && data.studentName && (
                <p className="text-sm text-gray-600 mt-1">{data.studentName}</p>
              )}
            </div>

            {/* Adherence Rate */}
            <div className={`rounded-lg p-4 mb-4 border ${getAdherenceColor(data.adherenceRate)}`}>
              <div className="text-center">
                <div className="text-3xl font-bold">{data.adherenceRate.toFixed(1)}%</div>
                <div className="text-sm font-medium mt-1">{getAdherenceStatus(data.adherenceRate)}</div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Scheduled:</span>
                <span className="font-medium">{data.totalScheduled}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Given:</span>
                <span className="font-medium text-green-600">{data.totalGiven}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Missed:</span>
                <span className="font-medium text-yellow-600">{data.totalMissed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Refused:</span>
                <span className="font-medium text-red-600">{data.totalRefused}</span>
              </div>
            </div>

            {/* 7-Day Trend */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Last 7 Days</h4>
              <div className="flex items-end justify-between h-16 gap-1">
                {data.lastSevenDays.map((day, index) => {
                  const height = day.scheduled > 0 ? (day.given / day.scheduled) * 100 : 0;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-200 rounded-t" style={{ height: '100%' }}>
                        <div
                          className="w-full bg-green-500 rounded-t"
                          style={{ height: `${height}%` }}
                          title={`${day.given}/${day.scheduled}`}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            {onViewDetails && (
              <Button size="sm" variant="outline" fullWidth onClick={() => onViewDetails(data.medicationId)}>
                View Details
              </Button>
            )}
          </div>
        ))}
      </div>

      {adherenceData.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No adherence data available</p>
        </div>
      )}
    </div>
  );
};

AdherenceTracker.displayName = 'AdherenceTracker';

export default AdherenceTracker;
