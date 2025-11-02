/**
 * @fileoverview Students Filters Component - Advanced filtering for student management
 * @module app/(dashboard)/students/_components/StudentsFilters
 * @category Students - Components
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStudentCount } from '@/app/students/actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Filter,
  X,
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react';

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

const GRADES = ['9th', '10th', '11th', '12th'];
const STATUSES = [
  { value: 'ACTIVE', label: 'Active', icon: UserCheck },
  { value: 'INACTIVE', label: 'Inactive', icon: UserX },
  { value: 'GRADUATED', label: 'Graduated', icon: GraduationCap },
  { value: 'TRANSFERRED', label: 'Transferred', icon: Users }
];

export function StudentsFilters({ searchParams }: StudentsFiltersProps) {
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const currentSearch = searchParams.search || '';
  const currentGrade = searchParams.grade || '';
  const currentStatus = searchParams.status || '';
  const currentHasHealthAlerts = searchParams.hasHealthAlerts || '';

  useEffect(() => {
    async function fetchStudentCount() {
      try {
        const filters: any = {
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
    }

    fetchStudentCount();
  }, [searchParams]);

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

  const clearAllFilters = useCallback(() => {
    router.push('/students');
  }, [router]);

  const activeFiltersCount = [currentGrade, currentStatus, currentHasHealthAlerts].filter(Boolean).length;

  const getFilterTags = () => {
    const tags = [];
    
    if (currentGrade) {
      tags.push({
        key: 'grade',
        label: `${currentGrade} Grade`,
        value: currentGrade
      });
    }
    
    if (currentStatus) {
      const status = STATUSES.find(s => s.value === currentStatus);
      tags.push({
        key: 'status',
        label: status?.label || currentStatus,
        value: currentStatus
      });
    }
    
    if (currentHasHealthAlerts === 'true') {
      tags.push({
        key: 'hasHealthAlerts',
        label: 'Has Health Alerts',
        value: currentHasHealthAlerts
      });
    }
    
    return tags;
  };

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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students by name, ID, or grade..."
            defaultValue={currentSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFilters('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search students"
          />
        </div>

        {/* Filter Tags */}
        {getFilterTags().length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {getFilterTags().map((tag) => (
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
              <div>
                <label htmlFor="grade-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Level
                </label>
                <select
                  id="grade-filter"
                  value={currentGrade}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFilters('grade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Grades</option>
                  {GRADES.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade} Grade
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={currentStatus}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFilters('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  {STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Health Alerts Filter */}
              <div>
                <label htmlFor="health-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Health Alerts
                </label>
                <select
                  id="health-filter"
                  value={currentHasHealthAlerts}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFilters('hasHealthAlerts', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Students</option>
                  <option value="true">With Health Alerts</option>
                  <option value="false">No Health Alerts</option>
                </select>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Quick Filters</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters('status', 'ACTIVE')}
                  className={currentStatus === 'ACTIVE' ? 'bg-blue-50 border-blue-200' : ''}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Active Students
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters('hasHealthAlerts', 'true')}
                  className={currentHasHealthAlerts === 'true' ? 'bg-orange-50 border-orange-200' : ''}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Health Alerts
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters('grade', '12th')}
                  className={currentGrade === '12th' ? 'bg-purple-50 border-purple-200' : ''}
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



