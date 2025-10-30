/**
 * @fileoverview Student Management Page Header Component
 * 
 * Header component for student management pages with search, filters, and actions.
 * 
 * @module components/pages/Students/StudentHeader
 * @since 1.0.0
 */

import { useState } from 'react';
import { Search, Filter, Plus, Download } from 'lucide-react';
import Link from 'next/link';

interface StudentHeaderProps {
  totalStudents: number;
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
}

/**
 * Student Header Component
 * 
 * Renders the header section with title, search, filters, and action buttons.
 */
export function StudentHeader({ totalStudents, onSearch, onFilterChange }: StudentHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Title and Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage student records and health information
            </p>
            <div className="mt-1">
              <span className="text-sm text-gray-500">
                {totalStudents} total students
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <Link
              href="/students/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Grade</label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="">All Grades</option>
                  <option value="K">Kindergarten</option>
                  <option value="1">1st Grade</option>
                  <option value="2">2nd Grade</option>
                  <option value="3">3rd Grade</option>
                  <option value="4">4th Grade</option>
                  <option value="5">5th Grade</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Health Status</label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="">All Students</option>
                  <option value="compliant">Compliant</option>
                  <option value="needs_attention">Needs Attention</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enrollment Status</label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <option value="">All Students</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="transferred">Transferred</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
