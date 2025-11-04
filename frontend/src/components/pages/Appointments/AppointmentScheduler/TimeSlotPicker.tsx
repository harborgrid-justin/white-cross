'use client';

import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { formatTime } from './utils';
import type { TimeSlot } from './types';

/**
 * Props for the TimeSlotPicker component
 */
interface TimeSlotPickerProps {
  /** Currently selected provider ID */
  selectedProvider: string;
  /** Currently selected date */
  selectedDate: Date | null;
  /** Available time slots */
  timeSlots: TimeSlot[];
  /** Currently selected time slot */
  selectedSlot: TimeSlot | null;
  /** Whether time slots are loading */
  loading: boolean;
  /** Handler for time slot selection */
  onSlotSelect: (slot: TimeSlot) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * TimeSlotPicker Component
 *
 * Displays available time slots in a grid layout with selection functionality.
 * Shows loading, empty, and error states appropriately.
 *
 * @param props - TimeSlotPicker component props
 * @returns JSX element representing the time slot picker
 */
const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedProvider,
  selectedDate,
  timeSlots,
  selectedSlot,
  loading,
  onSlotSelect,
  className = ''
}) => {
  /**
   * Renders the empty state when no provider or date is selected
   */
  const renderEmptyState = (): React.ReactElement => (
    <div className="text-center py-8 text-gray-500">
      <Clock size={48} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
      <p>Select a provider and date to view available times</p>
    </div>
  );

  /**
   * Renders the loading state
   */
  const renderLoadingState = (): React.ReactElement => (
    <div className="text-center py-8 text-gray-500" role="status" aria-live="polite">
      <Clock size={48} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
      <p>Loading available times...</p>
    </div>
  );

  /**
   * Renders the no slots available state
   */
  const renderNoSlotsState = (): React.ReactElement => (
    <div className="text-center py-8 text-gray-500">
      <Clock size={48} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
      <p>No available times for the selected date</p>
    </div>
  );

  /**
   * Renders the time slot grid
   */
  const renderTimeSlots = (): React.ReactElement => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {timeSlots.map((slot) => {
        const isSelected = selectedSlot?.id === slot.id;

        return (
          <button
            key={slot.id}
            onClick={() => onSlotSelect(slot)}
            disabled={!slot.available}
            className={`
              p-3 text-center rounded-lg border transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isSelected
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : slot.available
                ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              }
            `}
            aria-label={`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
            aria-pressed={isSelected}
          >
            <div className="text-sm font-medium">
              {formatTime(slot.startTime)}
            </div>
            <div className="text-xs text-gray-500">
              {slot.duration}min
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Available Times</h3>
        {loading && (
          <RefreshCw size={20} className="text-blue-500 animate-spin" aria-hidden="true" />
        )}
      </div>

      {!selectedProvider || !selectedDate
        ? renderEmptyState()
        : loading
        ? renderLoadingState()
        : timeSlots.length === 0
        ? renderNoSlotsState()
        : renderTimeSlots()}
    </div>
  );
};

export default TimeSlotPicker;
