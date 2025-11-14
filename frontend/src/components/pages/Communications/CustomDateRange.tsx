'use client';

import React from 'react';

interface CustomDateRangeProps {
  dateRange: {
    start: string;
    end: string;
  };
  onDateRangeChange: (range: { start: string; end: string }) => void;
}

/**
 * Custom date range selector component
 */
export const CustomDateRange: React.FC<CustomDateRangeProps> = ({
  dateRange,
  onDateRangeChange
}): React.ReactElement => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onDateRangeChange({ ...dateRange, start: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onDateRangeChange({ ...dateRange, end: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
