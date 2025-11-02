/**
 * Health Records Search Page
 * 
 * Route: /health-records/search
 * Advanced search functionality for health records
 */

'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Heart, Calendar } from 'lucide-react';

export default function HealthRecordsSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    recordType: '',
    severity: '',
    status: '',
    studentName: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        title="Advanced Health Records Search"
      />
      <p className="text-gray-600 mb-6">Find health records using detailed search criteria</p>

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
                  Search Records
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by diagnosis, medication, notes, or record title..."
                  />
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Record Type
                  </label>
                  <select
                    value={filters.recordType}
                    onChange={(e) => setFilters({ ...filters, recordType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by record type"
                  >
                    <option value="">All Types</option>
                    <option value="medication">💊 Medication</option>
                    <option value="allergy">⚠️ Allergy</option>
                    <option value="immunization">💉 Immunization</option>
                    <option value="condition">🩺 Medical Condition</option>
                    <option value="incident">📋 Incident Report</option>
                    <option value="visit">🏥 Nurse Visit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity Level
                  </label>
                  <select
                    value={filters.severity}
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by severity level"
                  >
                    <option value="">All Severities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
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
                    aria-label="Filter by record status"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="resolved">Resolved</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Student Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  value={filters.studentName}
                  onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter student name (optional)"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        dateRange: { ...filters.dateRange, start: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters({ 
                        ...filters, 
                        dateRange: { ...filters.dateRange, end: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Special Criteria */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Special Criteria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Requires follow-up</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Parent notified</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Emergency contact made</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Has attachments</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Records
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      recordType: '',
                      severity: '',
                      status: '',
                      studentName: '',
                      dateRange: { start: '', end: '' }
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
              <Heart className="h-5 w-5" />
              Search Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Enter search criteria above to find health records</p>
              <p className="text-sm mt-2">Results will include medications, allergies, incidents, and more</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Searches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Quick Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                ⚠️ Critical Allergies
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                💊 Active Medications
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                📋 Recent Incidents
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                🔄 Follow-up Required
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



