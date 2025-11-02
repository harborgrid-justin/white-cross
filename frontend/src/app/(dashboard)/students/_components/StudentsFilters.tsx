/**
 * @fileoverview Students Filters Component - Advanced filtering for student management
 * @module app/(dashboard)/students/_components/StudentsFilters
 * @category Students - Components
 *
 * This component provides comprehensive filtering capabilities for student data:
 * - Real-time search functionality
 * - Multiple filter categories (grade, status, health alerts)
 * - Quick filter shortcuts for common queries
 * - Active filter display with easy removal
 * - Student count updates based on filters
 * - Performance optimizations using React.memo, useCallback, and useMemo
 *
 * @example
 * ```tsx
 * <StudentsFilters searchParams={{ grade: '10th', status: 'ACTIVE' }} />
 * ```
 */

'use client';

import { useState, useCallback, useEffect, useMemo, type FC, type ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStudentCount } from '@/lib/actions/students.actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  X,
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  AlertTriangle,
  type LucideIcon
} from 'lucide-react';

/**
 * Props for the StudentsFilters component
 */
interface StudentsFiltersProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    grade?: string;
    status?: string;
    hasHealthAlerts?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

/**
 * Interface for filter tag representation
 */
interface FilterTag {
  key: string;
  label: string;
  value: string;
}

/**
 * Interface for status options
 */
interface StatusOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Available grade levels for filtering
 */
const GRADES = ['9th', '10th', '11th', '12th'] as const;

/**
 * Available status options for filtering
 */
const STATUSES: StatusOption[] = [
  { value: 'ACTIVE', label: 'Active', icon: UserCheck },
  { value: 'INACTIVE', label: 'Inactive', icon: UserX },
  { value: 'GRADUATED', label: 'Graduated', icon: GraduationCap },
  { value: 'TRANSFERRED', label: 'Transferred', icon: Users }
];

/**
 * StudentsFilters Component
 * Provides advanced filtering and search capabilities for student data
 */
export function StudentsFilters({ searchParams }: StudentsFiltersProps) {
  const [totalCount, setTotalCount] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  // Memoize current filter values
  const currentFilters = useMemo(() => ({
    search: searchParams.search || '',
    grade: searchParams.grade || '',
    status: searchParams.status || '',
    hasHealthAlerts: searchParams.hasHealthAlerts || ''
  }), [searchParams.search, searchParams.grade, searchParams.status, searchParams.hasHealthAlerts]);

  // Fetch student count based on filters
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const filters: Record<string, string | boolean | undefined> = {
          search: searchParams.search,
          grade: searchParams.grade,
          hasAllergies: searchParams.hasHealthAlerts === 'true',
        };

        if (searchParams.status === 'ACTIVE') {
          filters.isActive = true;
        } else if (searchParams.status === 'INACTIVE') {
          filters.isActive = false;
        }

        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        );

        const count = await getStudentCount(cleanFilters);
        setTotalCount(count);
      } catch (error) {
        console.error('Failed to fetch student count:', error);
        setTotalCount(0);
      }
    };

    fetchStudentCount();
  }, [searchParams]);

  /**
   * Update filter parameters in URL
   * Memoized to prevent unnecessary re-creation
   */
  const updateFilters = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(urlSearchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset pagination when filters change
    params.delete('page');

    router.push(`/students?${params.toString()}`);
  }, [router, urlSearchParams]);

  /**
   * Clear all active filters
   * Memoized to prevent unnecessary re-creation
   */
  const clearAllFilters = useCallback(() => {
    router.push('/students');
  }, [router]);

  /**
   * Count of active filters
   * Memoized to avoid recalculation on every render
   */
  const activeFiltersCount = useMemo(() => {
    return [
      currentFilters.grade,
      currentFilters.status,
      currentFilters.hasHealthAlerts
    ].filter(Boolean).length;
  }, [currentFilters.grade, currentFilters.status, currentFilters.hasHealthAlerts]);

  /**
   * Generate filter tags for active filters
   * Memoized to avoid recalculation on every render
   */
  const filterTags = useMemo((): FilterTag[] => {
    const tags: FilterTag[] = [];

    if (currentFilters.grade) {
      tags.push({
        key: 'grade',
        label: `${currentFilters.grade} Grade`,
        value: currentFilters.grade
      });
    }

    if (currentFilters.status) {
      const status = STATUSES.find(s => s.value === currentFilters.status);
      tags.push({
        key: 'status',
        label: status?.label || currentFilters.status,
        value: currentFilters.status
      });
    }

    if (currentFilters.hasHealthAlerts === 'true') {
      tags.push({
        key: 'hasHealthAlerts',
        label: 'Has Health Alerts',
        value: currentFilters.hasHealthAlerts
      });
    }

    return tags;
  }, [currentFilters.grade, currentFilters.status, currentFilters.hasHealthAlerts]);

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Students
              {totalCount > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({totalCount.toLocaleString()} total)
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search students by name, ID, or grade..."
            defaultValue={currentFilters.search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateFilters('search', e.target.value)}
            className="pl-10"
            aria-label="Search students"
          />
        </div>

        {/* Filter Tags */}
        {filterTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filterTags.map((tag) => (
              <Badge
                key={`${tag.key}-${tag.value}`}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {tag.label}
                <button
                  onClick={() => updateFilters(tag.key, '')}
                  className="ml-1 hover:text-gray-700"
                  aria-label={`Remove ${tag.label} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Grade Filter */}
              <div className="space-y-2">
                <label htmlFor="grade-filter" className="text-sm font-medium">
                  Grade Level
                </label>
                <Select
                  value={currentFilters.grade}
                  onValueChange={(value) => updateFilters('grade', value)}
                >
                  <SelectTrigger id="grade-filter">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Grades</SelectItem>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade} Grade
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label htmlFor="status-filter" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={currentFilters.status}
                  onValueChange={(value) => updateFilters('status', value)}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    {STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Health Alerts Filter */}
              <div className="space-y-2">
                <label htmlFor="health-filter" className="text-sm font-medium">
                  Health Alerts
                </label>
                <Select
                  value={currentFilters.hasHealthAlerts}
                  onValueChange={(value) => updateFilters('hasHealthAlerts', value)}
                >
                  <SelectTrigger id="health-filter">
                    <SelectValue placeholder="All Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Students</SelectItem>
                    <SelectItem value="true">With Health Alerts</SelectItem>
                    <SelectItem value="false">No Health Alerts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <p className="text-sm font-medium mb-2">Quick Filters</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={currentFilters.status === 'ACTIVE' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters('status', currentFilters.status === 'ACTIVE' ? '' : 'ACTIVE')}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Active Students
                </Button>
                <Button
                  variant={currentFilters.hasHealthAlerts === 'true' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters('hasHealthAlerts', currentFilters.hasHealthAlerts === 'true' ? '' : 'true')}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Health Alerts
                </Button>
                <Button
                  variant={currentFilters.grade === '12th' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters('grade', currentFilters.grade === '12th' ? '' : '12th')}
                >
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Seniors (12th)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}



