/**
 * Emergency Contacts Filters Component
 *
 * Student selector and search filters for contacts
 *
 * @module components/EmergencyContactsFilters
 */

import React from 'react';
import { Search } from 'lucide-react';
import type { EmergencyContactFilters } from '../types';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
}

interface EmergencyContactsFiltersProps {
  filters: EmergencyContactFilters;
  students: Student[];
  onFilterChange: (field: keyof EmergencyContactFilters, value: string) => void;
}

/**
 * Filters component with student selector and search
 */
export default function EmergencyContactsFilters({
  filters,
  students,
  onFilterChange,
}: EmergencyContactsFiltersProps) {
  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Student
          </label>
          <select
            value={filters.selectedStudent}
            onChange={(e) => onFilterChange('selectedStudent', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName} ({student.studentNumber})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Contacts
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange('searchQuery', e.target.value)}
              placeholder="Search by name or relationship..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
