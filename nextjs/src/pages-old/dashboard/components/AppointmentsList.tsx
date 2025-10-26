import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Calendar, 
  Filter, 
  Search, 
  Plus, 
  RefreshCw, 
  Download,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List
} from 'lucide-react';
import { Appointment } from './UpcomingAppointments';
import AppointmentCard from './AppointmentCard';

interface AppointmentsListProps {
  className?: string;
  appointments?: Appointment[];
  title?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
  viewMode?: 'card' | 'list';
  onAppointmentClick?: (appointment: Appointment) => void;
  onAppointmentEdit?: (appointment: Appointment) => void;
  onAppointmentCancel?: (appointment: Appointment) => void;
  onAppointmentConfirm?: (appointment: Appointment) => void;
  onAddAppointment?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

// Filter types
type AppointmentTypeFilter = 'all' | 'consultation' | 'follow-up' | 'procedure' | 'emergency' | 'telehealth';
type AppointmentStatusFilter = 'all' | 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
type AppointmentPriorityFilter = 'all' | 'low' | 'medium' | 'high' | 'urgent';
type TimeRangeFilter = 'all' | 'today' | 'tomorrow' | 'week' | 'month';

// Generate extended mock appointments
const generateExtendedMockAppointments = (): Appointment[] => [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    patientId: 'P-2024-001',
    type: 'consultation',
    title: 'Cardiology Consultation',
    description: 'Initial consultation for chest pain and irregular heartbeat',
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    duration: 45,
    location: 'Room 301 - Cardiology Wing',
    provider: { name: 'Dr. Michael Smith', role: 'Cardiologist', department: 'Cardiology' },
    status: 'confirmed',
    priority: 'high',
    contactMethod: 'in-person',
  },
  {
    id: '2',
    patientName: 'Robert Davis',
    patientId: 'P-2024-002',
    type: 'follow-up',
    title: 'Post-Surgery Follow-up',
    description: 'Follow-up appointment after knee replacement surgery',
    dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    duration: 30,
    location: 'Room 205 - Orthopedics',
    provider: { name: 'Dr. Jennifer Martinez', role: 'Orthopedic Surgeon', department: 'Orthopedics' },
    status: 'scheduled',
    priority: 'medium',
    contactMethod: 'in-person',
  },
  {
    id: '3',
    patientName: 'Maria Garcia',
    patientId: 'P-2024-003',
    type: 'telehealth',
    title: 'Diabetes Management',
    description: 'Remote consultation for diabetes monitoring and medication adjustment',
    dateTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    duration: 20,
    provider: { name: 'Dr. Anna Chen', role: 'Endocrinologist', department: 'Endocrinology' },
    status: 'confirmed',
    priority: 'medium',
    contactMethod: 'video',
  },
  {
    id: '4',
    patientName: 'James Miller',
    patientId: 'P-2024-004',
    type: 'procedure',
    title: 'Blood Work & Lab Tests',
    description: 'Routine blood work and comprehensive metabolic panel',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    duration: 15,
    location: 'Laboratory - Ground Floor',
    provider: { name: 'Lab Team', role: 'Medical Technician', department: 'Laboratory' },
    status: 'scheduled',
    priority: 'low',
    contactMethod: 'in-person',
  },
  {
    id: '5',
    patientName: 'David Thompson',
    patientId: 'P-2024-005',
    type: 'emergency',
    title: 'Emergency Assessment',
    description: 'Urgent assessment for severe abdominal pain',
    dateTime: new Date(Date.now() + 30 * 60 * 1000),
    duration: 60,
    location: 'Emergency Room',
    provider: { name: 'Dr. Lisa Wilson', role: 'Emergency Physician', department: 'Emergency Medicine' },
    status: 'confirmed',
    priority: 'urgent',
    contactMethod: 'in-person',
    notes: 'URGENT: Patient in severe pain, requires immediate attention',
  },
  {
    id: '6',
    patientName: 'Emily Brown',
    patientId: 'P-2024-006',
    type: 'consultation',
    title: 'Dermatology Consultation',
    description: 'Skin condition evaluation and treatment planning',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    duration: 30,
    location: 'Room 102 - Dermatology',
    provider: { name: 'Dr. Sarah Williams', role: 'Dermatologist', department: 'Dermatology' },
    status: 'scheduled',
    priority: 'medium',
    contactMethod: 'in-person',
  },
  {
    id: '7',
    patientName: 'Michael Clark',
    patientId: 'P-2024-007',
    type: 'telehealth',
    title: 'Mental Health Check-in',
    description: 'Regular mental health consultation and therapy session',
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    duration: 50,
    provider: { name: 'Dr. Rachel Green', role: 'Psychiatrist', department: 'Mental Health' },
    status: 'confirmed',
    priority: 'medium',
    contactMethod: 'video',
  },
];

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  className,
  appointments = generateExtendedMockAppointments(),
  title = 'Appointments',
  showFilters = true,
  showSearch = true,
  showActions = true,
  viewMode: initialViewMode = 'card',
  onAppointmentClick,
  onAppointmentEdit,
  onAppointmentCancel,
  onAppointmentConfirm,
  onAddAppointment,
  onRefresh,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<AppointmentTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<AppointmentPriorityFilter>('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState<TimeRangeFilter>('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>(initialViewMode);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const itemsPerPage = 12;

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        appointment.title.toLowerCase().includes(searchLower) ||
        appointment.patientName.toLowerCase().includes(searchLower) ||
        appointment.provider.name.toLowerCase().includes(searchLower) ||
        appointment.description?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && appointment.type !== typeFilter) return false;

    // Status filter
    if (statusFilter !== 'all' && appointment.status !== statusFilter) return false;

    // Priority filter
    if (priorityFilter !== 'all' && appointment.priority !== priorityFilter) return false;

    // Time range filter
    if (timeRangeFilter !== 'all') {
      const now = new Date();
      const appointmentDate = appointment.dateTime;
      const diffMs = appointmentDate.getTime() - now.getTime();
      
      switch (timeRangeFilter) {
        case 'today':
          if (appointmentDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'tomorrow': {
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (appointmentDate.toDateString() !== tomorrow.toDateString()) return false;
          break;
        }
        case 'week':
          if (diffMs > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case 'month':
          if (diffMs > 30 * 24 * 60 * 60 * 1000) return false;
          break;
      }
    }

    return true;
  });

  // Sort appointments by date
  const sortedAppointments = filteredAppointments.sort(
    (a, b) => a.dateTime.getTime() - b.dateTime.getTime()
  );

  // Pagination
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = sortedAppointments.slice(startIndex, startIndex + itemsPerPage);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setTimeRangeFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    searchTerm || 
    typeFilter !== 'all' || 
    statusFilter !== 'all' || 
    priorityFilter !== 'all' || 
    timeRangeFilter !== 'all';

  return (
    <div className={twMerge(clsx('bg-white rounded-lg border border-gray-200', className))}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('card')}
                className={clsx(
                  'p-1.5 rounded text-sm font-medium transition-colors',
                  viewMode === 'card'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                title="Card view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  'p-1.5 rounded text-sm font-medium transition-colors',
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Action Buttons */}
            {showActions && (
              <>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={clsx(
                    'p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100',
                    isRefreshing && 'animate-spin'
                  )}
                  title="Refresh appointments"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                
                {onExport && (
                  <button
                    onClick={onExport}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                    title="Export appointments"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                )}
                
                {onAddAppointment && (
                  <button
                    onClick={onAddAppointment}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Appointment
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="space-y-4">
            {/* Search Bar */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Filter Controls */}
            {showFilters && (
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as AppointmentTypeFilter)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Filter by appointment type"
                  >
                    <option value="all">All Types</option>
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="procedure">Procedure</option>
                    <option value="emergency">Emergency</option>
                    <option value="telehealth">Telehealth</option>
                  </select>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as AppointmentStatusFilter)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Filter by appointment status"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as AppointmentPriorityFilter)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Filter by appointment priority"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <select
                    value={timeRangeFilter}
                    onChange={(e) => setTimeRangeFilter(e.target.value as TimeRangeFilter)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Filter by time range"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {paginatedAppointments.length} of {filteredAppointments.length} appointments
          </span>
          {totalPages > 1 && (
            <span>
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
      </div>

      {/* Appointments Grid/List */}
      <div className={clsx(
        'p-6',
        viewMode === 'card' 
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
          : 'space-y-4'
      )}>
        {paginatedAppointments.length > 0 ? (
          paginatedAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              compact={viewMode === 'list'}
              onClick={onAppointmentClick}
              onEdit={onAppointmentEdit}
              onCancel={onAppointmentCancel}
              onConfirm={onAppointmentConfirm}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters or search term'
                : 'No appointments scheduled at this time'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            ) : onAddAppointment ? (
              <button
                onClick={onAddAppointment}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Appointment
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    'px-3 py-1 text-sm rounded-md',
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
