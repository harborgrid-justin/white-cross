'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, getWeekDays, isToday, isPast } from './utils';

/**
 * Props for the CalendarView component
 */
interface CalendarViewProps {
  /** Currently selected date */
  selectedDate: Date;
  /** Current week being displayed */
  currentWeek: Date;
  /** Handler for date selection */
  onDateSelect: (date: Date) => void;
  /** Handler for week navigation */
  onWeekChange: (newWeek: Date) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * CalendarView Component
 *
 * Displays a weekly calendar view with date selection.
 * Allows navigation between weeks and highlights today/selected dates.
 *
 * @param props - CalendarView component props
 * @returns JSX element representing the calendar week view
 */
const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  currentWeek,
  onDateSelect,
  onWeekChange,
  className = ''
}) => {
  const weekDays = getWeekDays(currentWeek);

  /**
   * Navigate to previous week
   */
  const handlePreviousWeek = (): void => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    onWeekChange(newWeek);
  };

  /**
   * Navigate to next week
   */
  const handleNextWeek = (): void => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    onWeekChange(newWeek);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Select Date</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousWeek}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Previous week"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
            {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Next week"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const selected = day.toDateString() === selectedDate.toDateString();
          const today = isToday(day);
          const past = isPast(day);

          return (
            <button
              key={index}
              onClick={() => !past && onDateSelect(day)}
              disabled={past}
              className={`
                p-3 text-center rounded-lg border-2 transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${selected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : past
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
                ${today && !selected ? 'ring-2 ring-blue-200' : ''}
              `}
              aria-label={formatDate(day)}
              aria-pressed={selected}
            >
              <div className="text-xs text-gray-500 mb-1">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-lg font-medium">
                {day.getDate()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
