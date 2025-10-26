/**
 * StudentFilter Component
 *
 * Production-grade student autocomplete selector with:
 * - Searchable student dropdown
 * - Multi-select capability
 * - Display of student name and ID
 * - Fetches students dynamically
 * - Accessible autocomplete interface
 *
 * @module pages/incidents/components/StudentFilter
 */

import React, { useState, useEffect } from 'react';
import { Select, SelectOption } from '@/components/ui/inputs/Select';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services';
import type { Student } from '@/types/student.types';

interface StudentFilterProps {
  /** Currently selected student IDs */
  selected: string[];
  /** Callback when selection changes */
  onChange: (studentIds: string[]) => void;
  /** Optional CSS class name */
  className?: string;
  /** Whether filter is disabled */
  disabled?: boolean;
  /** Label for the filter */
  label?: string;
  /** Whether to allow multiple student selection */
  multiple?: boolean;
}

/**
 * StudentFilter component
 *
 * Searchable autocomplete dropdown for selecting students.
 * Displays student name and ID for easy identification.
 * Supports both single and multi-select modes.
 *
 * @example
 * ```tsx
 * <StudentFilter
 *   selected={selectedStudentIds}
 *   onChange={(studentIds) => dispatch(setFilters({ studentId: studentIds[0] }))}
 *   multiple={false}
 * />
 * ```
 */
export const StudentFilter: React.FC<StudentFilterProps> = ({
  selected,
  onChange,
  className = '',
  disabled = false,
  label = 'Student',
  multiple = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch students with search query
  const {
    data: studentsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['students', 'list', { search: searchQuery, limit: 50 }],
    queryFn: async () => {
      const filters = {
        search: searchQuery || undefined,
        limit: 50,
        page: 1,
      };
      return studentsApi.getAll(filters);
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });

  const students = studentsResponse?.students || [];

  // Convert students to select options
  const studentOptions: SelectOption[] = students.map((student: Student) => ({
    value: student.id,
    label: `${student.firstName} ${student.lastName} (ID: ${student.studentNumber || student.id.slice(0, 8)})`,
  }));

  const handleChange = (value: string | number | (string | number)[]) => {
    if (Array.isArray(value)) {
      onChange(value as string[]);
    } else if (value) {
      onChange([value as string]);
    } else {
      onChange([]);
    }
  };

  // Get selected student labels
  const selectedStudents = students.filter((s: Student) => selected.includes(s.id));
  const selectionSummary = selectedStudents
    .map((s: Student) => `${s.firstName} ${s.lastName}`)
    .join(', ');

  return (
    <div className={className}>
      <Select
        label={label}
        options={studentOptions}
        value={multiple ? selected : selected[0] || ''}
        onChange={handleChange}
        placeholder={`Search for student${multiple ? 's' : ''}...`}
        multiple={multiple}
        searchable
        clearable
        disabled={disabled}
        loading={isLoading}
        size="md"
        variant="default"
      />

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          Failed to load students. Please try again.
        </p>
      )}

      {/* Selection summary */}
      {selected.length > 0 && (
        <div className="mt-2">
          {multiple && selected.length > 2 ? (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {selected.length} students selected
            </p>
          ) : (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Selected: <span className="font-medium">{selectionSummary || 'Unknown students'}</span>
            </p>
          )}
        </div>
      )}

      {/* Helper text */}
      {!error && students.length === 0 && !isLoading && searchQuery && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          No students found matching "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default StudentFilter;
