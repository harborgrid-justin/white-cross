'use client';

/**
 * @fileoverview Recurring Appointment Manager Component
 * @module components/appointments/RecurringAppointmentManager
 *
 * Client Component for managing recurring appointment series.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RecurringSeries {
  id: string;
  studentId: string;
  studentName: string;
  appointmentType: string;
  pattern: 'daily' | 'weekly' | 'monthly';
  frequency: number;
  daysOfWeek?: number[];
  startDate: string;
  endDate?: string;
  occurrences: number;
  nextOccurrences: Array<{
    date: string;
    time: string;
  }>;
}

interface RecurringAppointmentManagerProps {
  userId: string;
}

/**
 * RecurringAppointmentManager Component
 *
 * Displays and manages recurring appointment series.
 */
export function RecurringAppointmentManager({
  userId,
}: RecurringAppointmentManagerProps) {
  const [series, setSeries] = useState<RecurringSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch recurring series from API
    // For now, mock data
    setLoading(false);
    setSeries([
      {
        id: '1',
        studentId: 'student-1',
        studentName: 'John Doe',
        appointmentType: 'Medication Administration',
        pattern: 'weekly',
        frequency: 1,
        daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
        startDate: '2025-10-20',
        endDate: '2025-12-31',
        occurrences: 24,
        nextOccurrences: [
          { date: '2025-10-27', time: '09:00' },
          { date: '2025-10-29', time: '09:00' },
          { date: '2025-10-31', time: '09:00' },
        ],
      },
    ]);
  }, [userId]);

  const handleDeleteSeries = async (seriesId: string) => {
    if (!confirm('Are you sure you want to delete this entire series?')) {
      return;
    }

    // TODO: Implement delete series action
    console.log('Delete series:', seriesId);
    setSeries(series.filter((s) => s.id !== seriesId));
  };

  const handleEditSeries = (seriesId: string) => {
    // TODO: Navigate to edit page or open modal
    console.log('Edit series:', seriesId);
  };

  const getPatternDescription = (s: RecurringSeries) => {
    switch (s.pattern) {
      case 'daily':
        return `Every ${s.frequency} day${s.frequency > 1 ? 's' : ''}`;
      case 'weekly':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayNames = (s.daysOfWeek || []).map((d) => days[d]).join(', ');
        return `Every ${s.frequency} week${s.frequency > 1 ? 's' : ''} on ${dayNames}`;
      case 'monthly':
        return `Every ${s.frequency} month${s.frequency > 1 ? 's' : ''}`;
      default:
        return 'Unknown pattern';
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No recurring appointment series
        </h3>
        <p className="text-gray-600 mb-6">
          Create a recurring series to automatically schedule repeating appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {series.map((s) => (
        <div
          key={s.id}
          className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {s.appointmentType}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Student: <span className="font-medium">{s.studentName}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditSeries(s.id)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteSeries(s.id)}
              >
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">Pattern</div>
              <div className="font-medium text-gray-900">
                {getPatternDescription(s)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Start Date</div>
              <div className="font-medium text-gray-900">
                {new Date(s.startDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Occurrences</div>
              <div className="font-medium text-gray-900">{s.occurrences}</div>
            </div>
          </div>

          {selectedSeries === s.id && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Next Occurrences
              </h4>
              <div className="space-y-2">
                {s.nextOccurrences.map((occurrence, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">
                      {new Date(occurrence.date).toLocaleDateString()} at{' '}
                      {occurrence.time}
                    </span>
                    <Badge className="bg-blue-100 text-blue-800">
                      Scheduled
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() =>
              setSelectedSeries(selectedSeries === s.id ? null : s.id)
            }
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {selectedSeries === s.id
              ? 'Hide occurrences'
              : 'Show next occurrences'}
          </button>
        </div>
      ))}
    </div>
  );
}


