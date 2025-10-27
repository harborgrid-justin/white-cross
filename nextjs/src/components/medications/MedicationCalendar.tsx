'use client';

/**
 * MedicationCalendar Component
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export interface CalendarMedication {
  id: string;
  medicationName: string;
  studentName: string;
  scheduledTime: string;
  status: 'pending' | 'given' | 'missed' | 'refused';
}

export interface MedicationCalendarProps {
  medications: CalendarMedication[];
  onDateSelect?: (date: Date) => void;
  onMedicationClick?: (medicationId: string) => void;
}

export const MedicationCalendar: React.FC<MedicationCalendarProps> = ({
  medications,
  onDateSelect,
  onMedicationClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMedicationsForDate = (date: Date) => {
    return medications.filter((med) => {
      const medDate = new Date(med.scheduledTime);
      return (
        medDate.getDate() === date.getDate() &&
        medDate.getMonth() === date.getMonth() &&
        medDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={previousMonth}>
            Previous
          </Button>
          <Button size="sm" variant="outline" onClick={nextMonth}>
            Next
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-medium text-sm text-gray-600 py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for first week */}
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} className="border border-gray-100 rounded p-2 h-24" />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayMedications = getMedicationsForDate(date);
          const isToday =
            date.toDateString() === new Date().toDateString();

          return (
            <button
              key={day}
              onClick={() => onDateSelect?.(date)}
              className={`border rounded p-2 h-24 text-left hover:bg-gray-50 transition-colors ${
                isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="font-medium text-sm mb-1">{day}</div>
              {dayMedications.length > 0 && (
                <div className="text-xs">
                  <div className="text-gray-600">{dayMedications.length} meds</div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

MedicationCalendar.displayName = 'MedicationCalendar';

export default MedicationCalendar;
