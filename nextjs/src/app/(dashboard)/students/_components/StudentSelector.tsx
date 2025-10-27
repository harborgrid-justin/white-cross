'use client';

import { useState, useEffect } from 'react';
import { Combobox } from '@/components/ui/Inputs/Combobox';
import { SearchInput } from '@/components/ui/SearchInput';
import { Avatar } from '@/components/ui/display/Avatar';
import { Badge } from '@/components/ui/display/Badge';

/**
 * WF-COMP-STUDENT-004 | StudentSelector.tsx
 * Purpose: Searchable student selector with autocomplete functionality
 *
 * @module app/(dashboard)/students/_components/StudentSelector
 */

/**
 * Student option for selector
 */
export interface StudentOption {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  photoUrl?: string;
}

/**
 * Props for StudentSelector component
 */
interface StudentSelectorProps {
  /** Available student options */
  students: StudentOption[];
  /** Currently selected student ID */
  value?: string;
  /** Callback when student is selected */
  onChange: (studentId: string | undefined) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether selector is disabled */
  disabled?: boolean;
  /** Whether selector is loading */
  isLoading?: boolean;
  /** Whether to show inactive students */
  showInactive?: boolean;
  /** Optional className for styling */
  className?: string;
  /** Error message */
  error?: string;
}

/**
 * StudentSelector Component
 *
 * Searchable dropdown for selecting students with:
 * - Autocomplete search by name or student ID
 * - Student photo display
 * - Grade level and status indicators
 * - Keyboard navigation
 * - Filtering options
 *
 * **Features:**
 * - Real-time search filtering
 * - Student avatar display
 * - Status badges
 * - Grade level display
 * - Clear selection option
 * - Loading states
 * - Error handling
 *
 * **Accessibility:**
 * - Keyboard navigation
 * - ARIA labels and roles
 * - Focus management
 * - Screen reader support
 *
 * @component
 * @example
 * ```tsx
 * const [selectedStudent, setSelectedStudent] = useState<string>();
 *
 * <StudentSelector
 *   students={studentList}
 *   value={selectedStudent}
 *   onChange={setSelectedStudent}
 *   placeholder="Select a student..."
 * />
 * ```
 */
export function StudentSelector({
  students,
  value,
  onChange,
  placeholder = 'Search for a student...',
  disabled = false,
  isLoading = false,
  showInactive = false,
  className = '',
  error
}: StudentSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<StudentOption[]>(students);

  /**
   * Filter students based on search query and active status
   */
  useEffect(() => {
    let filtered = students;

    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter((student) => student.status === 'active');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(query) ||
          student.lastName.toLowerCase().includes(query) ||
          student.studentId.toLowerCase().includes(query) ||
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(query)
      );
    }

    setFilteredStudents(filtered);
  }, [students, searchQuery, showInactive]);

  /**
   * Get full name for a student
   */
  const getStudentName = (student: StudentOption) => {
    return `${student.firstName} ${student.lastName}`;
  };

  /**
   * Get selected student details
   */
  const selectedStudent = value
    ? students.find((student) => student.id === value)
    : undefined;

  /**
   * Get status badge variant
   */
  const getStatusVariant = (status: StudentOption['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'graduated':
        return 'default';
      case 'transferred':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="w-full"
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Selected Student Display */}
      {selectedStudent && !searchQuery && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={selectedStudent.photoUrl}
                alt={getStudentName(selectedStudent)}
                size="sm"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {getStudentName(selectedStudent)}
                </p>
                <p className="text-sm text-gray-600">
                  ID: {selectedStudent.studentId} • Grade {selectedStudent.gradeLevel}
                </p>
              </div>
              <Badge variant={getStatusVariant(selectedStudent.status)}>
                {selectedStudent.status}
              </Badge>
            </div>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              disabled={disabled}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear selection"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Student Options List */}
      {searchQuery && (
        <div className="mt-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
          {filteredStudents.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No students found</p>
              <p className="text-xs mt-1">Try adjusting your search</p>
            </div>
          ) : (
            <ul role="listbox" className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <li key={student.id} role="option" aria-selected={value === student.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(student.id);
                      setSearchQuery('');
                    }}
                    disabled={disabled}
                    className="w-full p-3 text-left hover:bg-gray-50 transition-colors focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={student.photoUrl}
                        alt={getStudentName(student)}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {getStudentName(student)}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          ID: {student.studentId} • Grade {student.gradeLevel}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(student.status)} className="shrink-0">
                        {student.status}
                      </Badge>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!error && !selectedStudent && (
        <p className="mt-2 text-xs text-gray-500">
          {showInactive
            ? 'Showing all students including inactive'
            : 'Showing active students only'}
        </p>
      )}
    </div>
  );
}
