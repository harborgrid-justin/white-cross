/**
 * Students Filters Component
 *
 * Client-side filtering with URL state management
 *
 * @module app/students/components/StudentsFilters
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Users } from 'lucide-react';
import { Card } from '@/components/ui/layout/Card';

const GRADES = ['9th', '10th', '11th', '12th'];

interface StudentsFiltersProps {
  initialParams?: {
    search?: string;
    grade?: string;
  };
}

export function StudentsFilters({ initialParams = {} }: StudentsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialParams.search || '');
  const [selectedGrade, setSelectedGrade] = useState(initialParams.grade || 'all');

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }

    if (selectedGrade && selectedGrade !== 'all') {
      params.set('grade', selectedGrade);
    } else {
      params.delete('grade');
    }

    // Reset to page 1 when filters change
    params.delete('page');

    // Use a debounce for search
    const timeoutId = setTimeout(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedGrade, router, searchParams]);

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Grade Filter */}
        <div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Grades</option>
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>
                {grade} Grade
              </option>
            ))}
          </select>
        </div>

        {/* Results Count (populated by parent) */}
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-2" />
          <span id="student-count">Loading...</span>
        </div>
      </div>
    </Card>
  );
}
