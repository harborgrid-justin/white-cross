'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Search,
  Filter,
  X,
  Calendar,
  User,
  AlertTriangle,
  Activity,
  Users,
  Shield,
  RefreshCw
} from 'lucide-react';

interface IncidentsFiltersProps {
  totalCount: number;
}

export function IncidentsFilters({ totalCount }: IncidentsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [severityFilter, setSeverityFilter] = useState(searchParams.get('severity') || '');
  const [dateFromFilter, setDateFromFilter] = useState(searchParams.get('dateFrom') || '');
  const [dateToFilter, setDateToFilter] = useState(searchParams.get('dateTo') || '');
  const [reportedByFilter, setReportedByFilter] = useState(searchParams.get('reportedBy') || '');
  const [studentFilter, setStudentFilter] = useState(searchParams.get('studentId') || '');

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (typeFilter) params.set('type', typeFilter);
    if (statusFilter) params.set('status', statusFilter);
    if (severityFilter) params.set('severity', severityFilter);
    if (dateFromFilter) params.set('dateFrom', dateFromFilter);
    if (dateToFilter) params.set('dateTo', dateToFilter);
    if (reportedByFilter) params.set('reportedBy', reportedByFilter);
    if (studentFilter) params.set('studentId', studentFilter);
    
    router.push(`/dashboard/incidents?${params.toString()}`);
  }, [
    searchTerm, typeFilter, statusFilter, severityFilter, 
    dateFromFilter, dateToFilter, reportedByFilter, studentFilter, router
  ]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
    setSeverityFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setReportedByFilter('');
    setStudentFilter('');
    router.push('/dashboard/incidents');
  };

  const hasActiveFilters = searchTerm || typeFilter || statusFilter || severityFilter || 
    dateFromFilter || dateToFilter || reportedByFilter || studentFilter;

  const activeFilterCount = [
    searchTerm, typeFilter, statusFilter, severityFilter, 
    dateFromFilter, dateToFilter, reportedByFilter, studentFilter
  ].filter(Boolean).length;

  const incidentTypes = [
    { value: 'INJURY', label: 'Injury', icon: AlertTriangle, color: 'text-red-600' },
    { value: 'ILLNESS', label: 'Illness', icon: Activity, color: 'text-blue-600' },
    { value: 'BEHAVIORAL', label: 'Behavioral', icon: Users, color: 'text-purple-600' },
    { value: 'SAFETY', label: 'Safety', icon: Shield, color: 'text-yellow-600' },
    { value: 'EMERGENCY', label: 'Emergency', icon: AlertTriangle, color: 'text-red-600' },
  ];

  const incidentStatuses = [
    { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'PENDING_REVIEW', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'UNDER_INVESTIGATION', label: 'Under Investigation', color: 'bg-blue-100 text-blue-800' },
    { value: 'REQUIRES_ACTION', label: 'Requires Action', color: 'bg-orange-100 text-orange-800' },
    { value: 'RESOLVED', label: 'Resolved', color: 'bg-green-100 text-green-800' },
    { value: 'ARCHIVED', label: 'Archived', color: 'bg-gray-100 text-gray-600' },
  ];

  const severityLevels = [
    { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Filter Incidents
            </h3>
            {activeFilterCount > 0 && (
              <Badge variant="info">
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={updateFilters}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Search Incidents
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, description, student name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && updateFilters()}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Main Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Incident Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by incident type"
            >
              <option value="">All Types</option>
              {incidentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by incident status"
            >
              <option value="">All Statuses</option>
              {incidentStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Severity
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by incident severity"
            >
              <option value="">All Severities</option>
              {severityLevels.map((severity) => (
                <option key={severity.value} value={severity.value}>
                  {severity.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reported By Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reported By
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Staff name or ID..."
                value={reportedByFilter}
                onChange={(e) => setReportedByFilter(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date From
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter from date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date To
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter to date"
              />
            </div>
          </div>
        </div>

        {/* Student Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Student
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Quick Filters</h4>
          <div className="flex flex-wrap gap-2">
            {incidentTypes.map((type) => {
              const Icon = type.icon;
              const isActive = typeFilter === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => {
                    setTypeFilter(isActive ? '' : type.value);
                    if (!isActive) updateFilters();
                  }}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className={`h-3 w-3 ${type.color}`} />
                  {type.label}
                </button>
              );
            })}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {incidentStatuses.slice(0, 4).map((status) => {
              const isActive = statusFilter === status.value;
              return (
                <button
                  key={status.value}
                  onClick={() => {
                    setStatusFilter(isActive ? '' : status.value);
                    if (!isActive) updateFilters();
                  }}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : status.color
                  }`}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {totalCount} incident{totalCount !== 1 ? 's' : ''} found
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear Filters
            </Button>
            <Button size="sm" onClick={updateFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}