'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Calendar,
  User,
  FileText,
  Stethoscope,
  Heart,
  AlertTriangle,
  Pill,
  Activity,
  Eye,
  Ruler,
  RefreshCw
} from 'lucide-react';

interface HealthRecordsFiltersProps {
  totalCount: number;
}

export function HealthRecordsFilters({ totalCount }: HealthRecordsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');
  const [dateFromFilter, setDateFromFilter] = useState(searchParams.get('dateFrom') || '');
  const [dateToFilter, setDateToFilter] = useState(searchParams.get('dateTo') || '');
  const [recordedByFilter, setRecordedByFilter] = useState(searchParams.get('recordedBy') || '');
  const [studentFilter, setStudentFilter] = useState(searchParams.get('studentId') || '');

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (typeFilter && typeFilter !== 'all-types') params.set('type', typeFilter);
    if (statusFilter && statusFilter !== 'all-statuses') params.set('status', statusFilter);
    if (priorityFilter && priorityFilter !== 'all-priorities') params.set('priority', priorityFilter);
    if (dateFromFilter) params.set('dateFrom', dateFromFilter);
    if (dateToFilter) params.set('dateTo', dateToFilter);
    if (recordedByFilter) params.set('recordedBy', recordedByFilter);
    if (studentFilter) params.set('studentId', studentFilter);
    
    router.push(`/health-records?${params.toString()}`);
  }, [
    searchTerm, typeFilter, statusFilter, priorityFilter, 
    dateFromFilter, dateToFilter, recordedByFilter, studentFilter, router
  ]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('all-types');
    setStatusFilter('all-statuses');
    setPriorityFilter('all-priorities');
    setDateFromFilter('');
    setDateToFilter('');
    setRecordedByFilter('');
    setStudentFilter('');
    router.push('/health-records');
  };

  const hasActiveFilters = searchTerm || 
    (typeFilter && typeFilter !== 'all-types') || 
    (statusFilter && statusFilter !== 'all-statuses') || 
    (priorityFilter && priorityFilter !== 'all-priorities') || 
    dateFromFilter || dateToFilter || recordedByFilter || studentFilter;

  const activeFilterCount = [
    searchTerm, 
    typeFilter && typeFilter !== 'all-types' ? typeFilter : null,
    statusFilter && statusFilter !== 'all-statuses' ? statusFilter : null,
    priorityFilter && priorityFilter !== 'all-priorities' ? priorityFilter : null,
    dateFromFilter, dateToFilter, recordedByFilter, studentFilter
  ].filter(Boolean).length;

  const recordTypes = [
    { value: 'MEDICAL_HISTORY', label: 'Medical History', icon: FileText, color: 'text-blue-600' },
    { value: 'PHYSICAL_EXAM', label: 'Physical Exam', icon: Stethoscope, color: 'text-green-600' },
    { value: 'IMMUNIZATION', label: 'Immunization', icon: Heart, color: 'text-purple-600' },
    { value: 'ALLERGY', label: 'Allergy', icon: AlertTriangle, color: 'text-red-600' },
    { value: 'MEDICATION', label: 'Medication', icon: Pill, color: 'text-orange-600' },
    { value: 'VITAL_SIGNS', label: 'Vital Signs', icon: Activity, color: 'text-cyan-600' },
    { value: 'GROWTH_CHART', label: 'Growth Chart', icon: Ruler, color: 'text-indigo-600' },
    { value: 'SCREENING', label: 'Screening', icon: Eye, color: 'text-teal-600' },
  ];

  const recordStatuses = [
    { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'INACTIVE', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
    { value: 'PENDING_REVIEW', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'ARCHIVED', label: 'Archived', color: 'bg-gray-100 text-gray-600' },
  ];

  const priorityLevels = [
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
              Filter Health Records
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
          <label className="block text-sm font-medium">
            Search Health Records
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by title, description, student name, or recorded by..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && updateFilters()}
              className="pl-10"
            />
          </div>
        </div>

        {/* Main Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Record Type
            </label>
            <Select value={typeFilter || 'all-types'} onValueChange={setTypeFilter}>
              <SelectTrigger aria-label="Filter by record type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                {recordTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Status
            </label>
            <Select value={statusFilter || 'all-statuses'} onValueChange={setStatusFilter}>
              <SelectTrigger aria-label="Filter by record status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                {recordStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Priority
            </label>
            <Select value={priorityFilter || 'all-priorities'} onValueChange={setPriorityFilter}>
              <SelectTrigger aria-label="Filter by record priority">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-priorities">All Priorities</SelectItem>
                {priorityLevels.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recorded By Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Recorded By
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Healthcare provider..."
                value={recordedByFilter}
                onChange={(e) => setRecordedByFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Date From
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
                className="pl-10"
                aria-label="Filter from date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Date To
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
                className="pl-10"
                aria-label="Filter to date"
              />
            </div>
          </div>
        </div>

        {/* Student Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Student
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by student name or ID..."
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Quick Filters</h4>
          <div className="flex flex-wrap gap-2">
            {recordTypes.slice(0, 5).map((type) => {
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
            {recordStatuses.map((status) => {
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

          <div className="flex flex-wrap gap-2">
            {priorityLevels.map((priority) => {
              const isActive = priorityFilter === priority.value;
              return (
                <button
                  key={priority.value}
                  onClick={() => {
                    setPriorityFilter(isActive ? '' : priority.value);
                    if (!isActive) updateFilters();
                  }}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : priority.color
                  }`}
                >
                  {priority.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {totalCount} health record{totalCount !== 1 ? 's' : ''} found
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
