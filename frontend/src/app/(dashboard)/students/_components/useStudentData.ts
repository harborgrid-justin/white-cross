/**
 * @fileoverview Custom Hook for Student Data Management
 * @module app/(dashboard)/students/_components/useStudentData
 * @category Students - Hooks
 *
 * This hook encapsulates all student data fetching, selection, and export logic:
 * - Fetches students based on search parameters
 * - Manages loading and error states
 * - Handles multi-select functionality for bulk operations
 * - Provides CSV export capabilities
 * - Computes statistics from student data
 *
 * @example
 * ```tsx
 * const {
 *   students,
 *   loading,
 *   selectedStudents,
 *   handleSelectStudent,
 *   handleSelectAll,
 *   handleExport,
 *   stats
 * } = useStudentData(searchParams);
 * ```
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getStudents } from '@/lib/actions/students.actions';
import type { Student } from '@/types/student.types';
import { hasHealthAlerts } from './student.utils';

/**
 * Search parameters for filtering students
 */
export interface StudentSearchParams {
  page?: string;
  limit?: string;
  search?: string;
  grade?: string;
  status?: string;
  hasHealthAlerts?: string;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Statistics computed from student data
 */
export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  healthAlertsCount: number;
  presentToday: number;
}

/**
 * Return type for useStudentData hook
 */
export interface UseStudentDataReturn {
  students: Student[];
  loading: boolean;
  selectedStudents: Set<string>;
  handleSelectStudent: (studentId: string) => void;
  handleSelectAll: () => void;
  handleExport: () => void;
  stats: StudentStats;
}

/**
 * Custom hook for managing student data
 *
 * PERFORMANCE OPTIMIZATION:
 * - Uses useCallback for memoized event handlers
 * - Uses useMemo for computed statistics
 * - Prevents unnecessary re-renders with Set-based selection
 *
 * PHI CONSIDERATION:
 * - CSV export includes PHI (names, contact info)
 * - Ensure proper access controls are in place before using export
 *
 * @param searchParams - Filter parameters from URL search params
 * @returns Student data, selection state, and handler functions
 */
export function useStudentData(searchParams: StudentSearchParams): UseStudentDataReturn {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  /**
   * Fetch students data based on search params
   * Effect runs when searchParams change
   */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        // Build filters from searchParams
        const filters: Record<string, string | boolean | undefined> = {
          search: searchParams.search,
          grade: searchParams.grade,
          hasAllergies: searchParams.hasHealthAlerts === 'true',
        };

        // Only add isActive filter if a specific status is requested
        if (searchParams.status === 'ACTIVE') {
          filters.isActive = true;
        } else if (searchParams.status === 'INACTIVE') {
          filters.isActive = false;
        }
        // If no status specified, don't filter by isActive (show all students)

        // Remove undefined values
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        );

        const studentsData = await getStudents(cleanFilters);
        setStudents(studentsData);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        // Set empty array on error instead of using mock data
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [searchParams]);

  /**
   * Handle individual student selection
   * Memoized to prevent unnecessary re-renders
   *
   * @param studentId - ID of student to toggle selection
   */
  const handleSelectStudent = useCallback((studentId: string) => {
    setSelectedStudents(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(studentId)) {
        newSelected.delete(studentId);
      } else {
        newSelected.add(studentId);
      }
      return newSelected;
    });
  }, []);

  /**
   * Handle select all / deselect all
   * Memoized to prevent unnecessary re-renders
   * Toggles between selecting all students and deselecting all
   */
  const handleSelectAll = useCallback(() => {
    setSelectedStudents(prevSelected => {
      if (prevSelected.size === students.length) {
        return new Set();
      } else {
        return new Set(students.map((s: Student) => s.id));
      }
    });
  }, [students]);

  /**
   * Handle CSV export of selected students
   * Memoized to prevent unnecessary re-creation
   *
   * PHI WARNING: This function exports PHI data including:
   * - Student names
   * - Student IDs
   * - Contact information
   *
   * Ensure proper access controls and audit logging are in place
   */
  const handleExport = useCallback(() => {
    const selectedStudentData = students.filter(s => selectedStudents.has(s.id));
    const csvContent = [
      'Student ID,Name,Grade,Status,Phone,Email',
      ...selectedStudentData.map(s =>
        `${s.studentNumber},"${s.firstName} ${s.lastName}",${s.grade},${s.isActive ? 'Active' : 'Inactive'},${s.emergencyContacts?.[0]?.phoneNumber || 'N/A'},${s.emergencyContacts?.[0]?.email || 'N/A'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [students, selectedStudents]);

  /**
   * Computed statistics - memoized to avoid recalculation on every render
   *
   * PERFORMANCE: Only recalculates when students array changes
   */
  const stats = useMemo((): StudentStats => {
    const totalStudents = students.length;
    const activeStudents = students.filter((s: Student) => s.isActive).length;
    const healthAlertsCount = students.filter((s: Student) => hasHealthAlerts(s)).length;
    const presentToday = activeStudents; // In a real system, this would be from attendance data

    return {
      totalStudents,
      activeStudents,
      healthAlertsCount,
      presentToday
    };
  }, [students]);

  return {
    students,
    loading,
    selectedStudents,
    handleSelectStudent,
    handleSelectAll,
    handleExport,
    stats
  };
}
