/**
 * Student Search Page
 * 
 * Route: /students/search
 * Advanced search functionality for students
 */

'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Search, Filter, User, GraduationCap } from 'lucide-react';

export default function StudentSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    grade: '',
    status: '',
    school: '',
    hasAllergies: false,
    hasMedications: false
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Advanced Student Search"
      />
      <p className="text-gray-600 mb-6">Find students using detailed search criteria</p>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Name or Student ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter student name or ID..."
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <select
                    value={filters.grade}
                    onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by grade"
                  >
                    <option value="">All Grades</option>
                    {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by status"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="transferred">Transferred</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School
                  </label>
                  <input
                    type="text"
                    value={filters.school}
                    onChange={(e) => setFilters({ ...filters, school: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter school name"
                  />
                </div>
              </div>

              {/* Medical Filters */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Medical Criteria</h3>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasAllergies}
                      onChange={(e) => setFilters({ ...filters, hasAllergies: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Has Allergies</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.hasMedications}
                      onChange={(e) => setFilters({ ...filters, hasMedications: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Takes Medications</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Students
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      grade: '',
                      status: '',
                      school: '',
                      hasAllergies: false,
                      hasMedications: false
                    });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Search Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Enter search criteria above to find students</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}