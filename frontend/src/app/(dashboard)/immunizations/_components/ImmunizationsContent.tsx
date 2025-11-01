'use client';

/**
 * Force dynamic rendering for real-time immunization data
 */


import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Plus,
  Filter,
  List,
  Grid3x3,
  Edit,
  Eye,
  CheckCircle,
  Shield,
  Syringe,
  Download,
  Upload,
  MoreVertical,
  Bell,
  AlertTriangle,
  Thermometer,
  Heart,
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/SearchInput';

// Import server actions
import { 
  getImmunizationRecords, 
  getImmunizationsDashboardData,
  getImmunizationStats,
  type ImmunizationRecord 
} from '@/app/immunizations/actions';

// Healthcare immunization types and statuses
type ImmunizationType = 'covid19' | 'flu' | 'hepatitis_b' | 'measles' | 'mumps' | 'rubella' | 'polio' | 'tetanus' | 'diphtheria' | 'pertussis' | 'varicella' | 'meningococcal' | 'hpv' | 'pneumococcal';
type ImmunizationStatus = 'scheduled' | 'administered' | 'declined' | 'deferred' | 'overdue' | 'completed' | 'contraindicated';
type ImmunizationPriority = 'low' | 'medium' | 'high' | 'urgent';
type ViewMode = 'calendar' | 'list' | 'schedule';

interface Immunization {
  id: string;
  studentId: string;
  studentName?: string;
  vaccineName: string;
  immunizationType: ImmunizationType;
  scheduledDate?: string;
  administeredDate?: string;
  dueDate: string;
  status: ImmunizationStatus;
  priority: ImmunizationPriority;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  notes?: string;
  reactions?: string[];
  nextDue?: string;
  seriesPosition?: string; // e.g., "1 of 3"
  createdAt: string;
  updatedAt: string;
}

interface ImmunizationStats {
  totalStudents: number;
  upToDate: number;
  overdue: number;
  scheduled: number;
  declined: number;
  complianceRate: number;
  dueThisWeek: number;
  dueThisMonth: number;
}

interface ImmunizationsContentProps {
  initialImmunizations?: Immunization[];
  userRole?: string;
}

const ImmunizationsContent: React.FC<ImmunizationsContentProps> = ({ 
  initialImmunizations = []
}) => {
  const [immunizations, setImmunizations] = useState<Immunization[]>(initialImmunizations);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<ImmunizationStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ImmunizationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedImmunizations, setSelectedImmunizations] = useState<Set<string>>(new Set());
  // Load immunization data from server actions
  useEffect(() => {
    async function fetchImmunizations() {
      try {
        setLoading(true);
        
        // Load immunizations from server actions
        const immunizationRecords = await getImmunizationRecords();
        
        // Transform ImmunizationRecord[] to Immunization[] for UI compatibility
        const transformedData: Immunization[] = immunizationRecords.map((record: ImmunizationRecord) => ({
          id: record.id,
          studentId: record.studentId,
          studentName: record.studentName || 'Unknown Student',
          vaccineName: record.vaccineName,
          immunizationType: (record.vaccineType?.toLowerCase() || 'covid19') as ImmunizationType,
          scheduledDate: undefined, // Not available in ImmunizationRecord
          administeredDate: record.administeredDate,
          dueDate: record.nextDueDate || new Date().toISOString().split('T')[0],
          status: record.administeredDate ? 'administered' : 'scheduled' as ImmunizationStatus,
          priority: 'medium' as ImmunizationPriority, // Default priority
          seriesPosition: record.doseNumber ? `${record.doseNumber}` : '1',
          notes: record.notes,
          lotNumber: record.lotNumber,
          manufacturer: record.manufacturer,
          administeredBy: record.administeredByName || record.administeredBy,
          nextDue: record.nextDueDate,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt
        }));
        
        setImmunizations(transformedData);
      } catch (error) {
        console.error('Failed to load immunizations:', error);
        setImmunizations([]);
      } finally {
        setLoading(false);
      }
    }

    if (initialImmunizations.length > 0) {
      setImmunizations(initialImmunizations);
      setLoading(false);
    } else {
      fetchImmunizations();
    }
  }, [initialImmunizations]);

  // Keep mock data as fallback for now
  React.useEffect(() => {
    if (initialImmunizations.length === 0 && immunizations.length === 0 && !loading) {
      // Mock data for development - replace with real API calls
      const now = new Date();
      const mockImmunizations: Immunization[] = [
        {
          id: 'imm-001',
          studentId: 'student-001',
          studentName: 'Emily Johnson',
          vaccineName: 'COVID-19 Pfizer-BioNTech',
          immunizationType: 'covid19',
          scheduledDate: now.toISOString().split('T')[0],
          dueDate: now.toISOString().split('T')[0],
          status: 'scheduled',
          priority: 'high',
          seriesPosition: '2 of 2',
          notes: 'Student has no known allergies',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        },
        {
          id: 'imm-002',
          studentId: 'student-002',
          studentName: 'Michael Chen',
          vaccineName: 'Influenza Quadrivalent',
          immunizationType: 'flu',
          administeredDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'administered',
          priority: 'medium',
          lotNumber: 'FL2024-001',
          manufacturer: 'Sanofi Pasteur',
          administeredBy: 'Nurse Williams',
          seriesPosition: '1 of 1',
          nextDue: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        },
        {
          id: 'imm-003',
          studentId: 'student-003',
          studentName: 'Sarah Martinez',
          vaccineName: 'MMR (Measles, Mumps, Rubella)',
          immunizationType: 'measles',
          dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'overdue',
          priority: 'urgent',
          seriesPosition: '2 of 2',
          notes: 'Parent requested delay, follow up needed',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        },
        {
          id: 'imm-004',
          studentId: 'student-004',
          studentName: 'David Thompson',
          vaccineName: 'Hepatitis B',
          immunizationType: 'hepatitis_b',
          scheduledDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'scheduled',
          priority: 'medium',
          seriesPosition: '3 of 3',
          notes: 'Final dose in series',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        },
        {
          id: 'imm-005',
          studentId: 'student-005',
          studentName: 'Jessica Lee',
          vaccineName: 'Tdap (Tetanus, Diphtheria, Pertussis)',
          immunizationType: 'tetanus',
          dueDate: now.toISOString().split('T')[0],
          status: 'declined',
          priority: 'high',
          seriesPosition: '1 of 1',
          notes: 'Religious exemption on file',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        },
        {
          id: 'imm-006',
          studentId: 'student-006',
          studentName: 'Alexander Brown',
          vaccineName: 'Varicella (Chickenpox)',
          immunizationType: 'varicella',
          administeredDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dueDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'administered',
          priority: 'medium',
          lotNumber: 'VAR2024-089',
          manufacturer: 'Merck',
          administeredBy: 'Nurse Johnson',
          seriesPosition: '2 of 2',
          reactions: ['Mild soreness at injection site'],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        }
      ];

      setImmunizations(mockImmunizations);
      setLoading(false);
    }
  }, [initialImmunizations]);

  // Calculate immunization statistics
  const stats: ImmunizationStats = React.useMemo(() => {
    const uniqueStudents = new Set(immunizations.map(imm => imm.studentId));
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      totalStudents: uniqueStudents.size,
      upToDate: immunizations.filter(imm => imm.status === 'administered' || imm.status === 'completed').length,
      overdue: immunizations.filter(imm => imm.status === 'overdue').length,
      scheduled: immunizations.filter(imm => imm.status === 'scheduled').length,
      declined: immunizations.filter(imm => imm.status === 'declined').length,
      complianceRate: uniqueStudents.size > 0 
        ? (immunizations.filter(imm => imm.status === 'administered' || imm.status === 'completed').length / uniqueStudents.size) * 100 
        : 0,
      dueThisWeek: immunizations.filter(imm => {
        const dueDate = new Date(imm.dueDate);
        return dueDate <= weekFromNow && ['scheduled', 'overdue'].includes(imm.status);
      }).length,
      dueThisMonth: immunizations.filter(imm => {
        const dueDate = new Date(imm.dueDate);
        return dueDate <= monthFromNow && ['scheduled', 'overdue'].includes(imm.status);
      }).length,
    };
  }, [immunizations]);

  // Filter immunizations
  const filteredImmunizations = React.useMemo(() => {
    let filtered = immunizations;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(imm => imm.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(imm => imm.immunizationType === typeFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(imm =>
        imm.vaccineName.toLowerCase().includes(query) ||
        imm.studentName?.toLowerCase().includes(query) ||
        imm.studentId.toLowerCase().includes(query) ||
        imm.immunizationType.toLowerCase().includes(query) ||
        imm.notes?.toLowerCase().includes(query)
      );
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityCompare = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityCompare !== 0) return priorityCompare;
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [immunizations, statusFilter, typeFilter, searchQuery]);

  // Utility functions
  const getStatusBadge = (status: ImmunizationStatus) => {
    const variants = {
      scheduled: 'bg-blue-100 text-blue-800',
      administered: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      deferred: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-orange-100 text-orange-800',
      completed: 'bg-gray-100 text-gray-800',
      contraindicated: 'bg-purple-100 text-purple-800'
    };
    return <Badge className={variants[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: ImmunizationPriority) => {
    const variants = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800', 
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return <Badge className={variants[priority]}>{priority}</Badge>;
  };

  const getTypeIcon = (type: ImmunizationType) => {
    const icons = {
      covid19: Shield,
      flu: Thermometer,
      hepatitis_b: Heart,
      measles: Activity,
      mumps: Activity,
      rubella: Activity,
      polio: Activity,
      tetanus: Shield,
      diphtheria: Shield,
      pertussis: Shield,
      varicella: Activity,
      meningococcal: Shield,
      hpv: Shield,
      pneumococcal: Shield
    };
    const IconComponent = icons[type] || Syringe;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate: string, status: ImmunizationStatus): boolean => {
    return new Date(dueDate) < new Date() && !['administered', 'completed', 'declined', 'contraindicated'].includes(status);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Immunization Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.complianceRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.upToDate} of {stats.totalStudents} students
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due This Week</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.dueThisWeek}</p>
                <p className="text-xs text-gray-500 mt-1">Scheduled immunizations</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</p>
                <p className="text-xs text-gray-500 mt-1">Require immediate attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.scheduled}</p>
                <p className="text-xs text-gray-500 mt-1">Upcoming immunizations</p>
              </div>
              <Syringe className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Immunization Management Controls */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Primary Actions */}
            <div className="flex items-center gap-3">
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Immunization
              </Button>
              
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Records
              </Button>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>

              {selectedImmunizations.size > 0 && (
                <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                  <span className="text-sm text-gray-600">
                    {selectedImmunizations.size} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle bulk reschedule */}}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Handle bulk notifications */}}
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    Notify
                  </Button>
                </div>
              )}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <div className="w-64">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search immunizations, students, or vaccines..."
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-gray-100' : ''}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List view"
                  aria-label="Switch to list view"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${
                    viewMode === 'calendar'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Calendar view"
                  aria-label="Switch to calendar view"
                >
                  <Calendar className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('schedule')}
                  className={`px-3 py-2 text-sm border-l border-gray-300 ${
                    viewMode === 'schedule'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Schedule view"
                  aria-label="Switch to schedule view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ImmunizationStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by immunization status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="administered">Administered</option>
                    <option value="overdue">Overdue</option>
                    <option value="declined">Declined</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vaccine Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as ImmunizationType | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by vaccine type"
                  >
                    <option value="all">All Types</option>
                    <option value="covid19">COVID-19</option>
                    <option value="flu">Influenza</option>
                    <option value="measles">MMR</option>
                    <option value="hepatitis_b">Hepatitis B</option>
                    <option value="tetanus">Tdap</option>
                    <option value="varicella">Varicella</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Select date range"
                    aria-label="Select date range for immunizations"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusFilter('all');
                      setTypeFilter('all');
                      setSearchQuery('');
                      setSelectedDate(new Date());
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Main Immunization Display */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Immunizations ({filteredImmunizations.length})
          </h2>
          
          {filteredImmunizations.length === 0 ? (
            <div className="text-center py-12">
              <Syringe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">No immunizations found</p>
              <p className="text-sm text-gray-400 mb-4">
                Try adjusting your filters or schedule a new immunization.
              </p>
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Immunization
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredImmunizations.map((immunization) => (
                <div
                  key={immunization.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                    isOverdue(immunization.dueDate, immunization.status) 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedImmunizations.has(immunization.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedImmunizations);
                            if (e.target.checked) {
                              newSelected.add(immunization.id);
                            } else {
                              newSelected.delete(immunization.id);
                            }
                            setSelectedImmunizations(newSelected);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label={`Select immunization: ${immunization.vaccineName}`}
                        />
                        
                        {getTypeIcon(immunization.immunizationType)}
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {immunization.vaccineName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {immunization.studentName} • {immunization.studentId}
                          </p>
                        </div>

                        {isOverdue(immunization.dueDate, immunization.status) && (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <div className="font-medium">{formatDate(immunization.dueDate)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Series:</span>
                          <div className="font-medium">{immunization.seriesPosition || 'Single dose'}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Priority:</span>
                          <div className="font-medium">{getPriorityBadge(immunization.priority)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <div className="font-medium capitalize">
                            {immunization.immunizationType.replace('_', ' ')}
                          </div>
                        </div>
                      </div>

                      {immunization.administeredDate && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3 p-2 bg-green-50 rounded">
                          <div>
                            <span className="text-gray-500">Administered:</span>
                            <div className="font-medium">{formatDate(immunization.administeredDate)}</div>
                          </div>
                          {immunization.lotNumber && (
                            <div>
                              <span className="text-gray-500">Lot #:</span>
                              <div className="font-medium">{immunization.lotNumber}</div>
                            </div>
                          )}
                          {immunization.administeredBy && (
                            <div>
                              <span className="text-gray-500">Administered by:</span>
                              <div className="font-medium">{immunization.administeredBy}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {immunization.reactions && immunization.reactions.length > 0 && (
                        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <span className="text-sm font-medium text-yellow-800">Reactions:</span>
                          <ul className="text-sm text-yellow-700 mt-1">
                            {immunization.reactions.map((reaction, index) => (
                              <li key={index}>• {reaction}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {immunization.notes && (
                        <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                          <strong>Notes:</strong> {immunization.notes}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(immunization.status)}
                        {immunization.nextDue && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Next due: {formatDate(immunization.nextDue)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Immunization Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" title="View details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="ghost" size="sm" title="Edit immunization">
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {immunization.status === 'scheduled' && (
                        <Button variant="ghost" size="sm" title="Mark as administered">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm" title="More options">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ImmunizationsContent;