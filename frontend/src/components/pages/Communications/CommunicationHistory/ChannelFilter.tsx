'use client';

import React from 'react';
import type { CommunicationRecord } from './types';

/**
 * Props for the ChannelFilter component
 */
export interface ChannelFilterProps {
  /** Currently selected channel type */
  selectedType: string;
  /** Callback when type changes */
  onTypeChange: (type: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ChannelFilter component for filtering by communication channel/type
 *
 * Features:
 * - Filter by email, SMS, phone, or chat
 * - Clear visual selection state
 * - Accessible with proper ARIA labels
 *
 * @component
 * @example
 * ```tsx
 * <ChannelFilter
 *   selectedType={filters.type}
 *   onTypeChange={(type) => setFilter('type', type)}
 * />
 * ```
 */
export const ChannelFilter: React.FC<ChannelFilterProps> = ({
  selectedType,
  onTypeChange,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(e.target.value);
  };

  return (
    <select
      value={selectedType}
      onChange={handleChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      aria-label="Filter by communication type"
    >
      <option value="">All Types</option>
      <option value="email">Email</option>
      <option value="sms">SMS</option>
      <option value="phone">Phone</option>
      <option value="chat">Chat</option>
    </select>
  );
};

export default ChannelFilter;
