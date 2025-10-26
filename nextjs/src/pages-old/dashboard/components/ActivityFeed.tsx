import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Filter, Search, Calendar, RefreshCw, Download, Clock } from 'lucide-react';
import { Activity } from './RecentActivities';
import ActivityItem from './ActivityItem';

interface ActivityFeedProps {
  className?: string;
  activities?: Activity[];
  title?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  onActivityClick?: (activity: Activity) => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

// Filter types
type ActivityTypeFilter = 'all' | 'appointment' | 'patient' | 'medication' | 'alert' | 'system';
type ActivityStatusFilter = 'all' | 'success' | 'warning' | 'error' | 'info';
type TimeFilter = 'all' | 'today' | 'week' | 'month';

// Generate more comprehensive mock data for the feed
const generateExtensiveMockActivities = (): Activity[] => [
  {
    id: '1',
    type: 'appointment',
    title: 'New Appointment Scheduled',
    description: 'Dr. Smith scheduled appointment with Sarah Johnson for cardiology consultation',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    user: { name: 'Dr. Michael Smith', role: 'Cardiologist' },
    status: 'success',
    metadata: { patientName: 'Sarah Johnson', appointmentTime: '2:30 PM', department: 'Cardiology' },
  },
  {
    id: '2',
    type: 'patient',
    title: 'Patient Check-in',
    description: 'Robert Davis checked in for his scheduled consultation',
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    user: { name: 'Emma Wilson', role: 'Receptionist' },
    status: 'info',
    metadata: { patientName: 'Robert Davis', department: 'General Medicine' },
  },
  {
    id: '3',
    type: 'medication',
    title: 'Medication Prescribed',
    description: 'Prescribed Lisinopril 10mg to Maria Garcia for hypertension management',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    user: { name: 'Dr. Jennifer Lee', role: 'Internal Medicine' },
    status: 'success',
    metadata: { patientName: 'Maria Garcia', medicationName: 'Lisinopril 10mg' },
  },
  {
    id: '4',
    type: 'alert',
    title: 'Critical Lab Result',
    description: 'Abnormal glucose levels detected for James Miller - requires immediate attention',
    timestamp: new Date(Date.now() - 78 * 60 * 1000),
    user: { name: 'Lab System', role: 'Automated Alert' },
    status: 'warning',
    metadata: { patientName: 'James Miller', department: 'Laboratory' },
  },
  {
    id: '5',
    type: 'system',
    title: 'System Maintenance Completed',
    description: 'Scheduled maintenance for patient database completed successfully',
    timestamp: new Date(Date.now() - 120 * 60 * 1000),
    user: { name: 'System Admin', role: 'IT Department' },
    status: 'success',
  },
  {
    id: '6',
    type: 'appointment',
    title: 'Appointment Cancelled',
    description: 'David Thompson cancelled his orthopedics appointment scheduled for next week',
    timestamp: new Date(Date.now() - 185 * 60 * 1000),
    user: { name: 'Lisa Chen', role: 'Scheduler' },
    status: 'error',
    metadata: { patientName: 'David Thompson', department: 'Orthopedics' },
  },
  {
    id: '7',
    type: 'patient',
    title: 'New Patient Registration',
    description: 'Anna Rodriguez completed registration and initial assessment',
    timestamp: new Date(Date.now() - 240 * 60 * 1000),
    user: { name: 'Carlos Martinez', role: 'Registration Clerk' },
    status: 'success',
    metadata: { patientName: 'Anna Rodriguez', department: 'Registration' },
  },
  {
    id: '8',
    type: 'alert',
    title: 'Medication Interaction Alert',
    description: 'Potential drug interaction detected for prescribed medications',
    timestamp: new Date(Date.now() - 300 * 60 * 1000),
    user: { name: 'Pharmacy System', role: 'Automated Alert' },
    status: 'warning',
    metadata: { patientName: 'Peter Johnson', department: 'Pharmacy' },
  },
];

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  className,
  activities = generateExtensiveMockActivities(),
  title = 'Activity Feed',
  showFilters = true,
  showSearch = true,
  showRefresh = true,
  showExport = true,
  onActivityClick,
  onRefresh,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ActivityTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<ActivityStatusFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter activities based on current filters
  const filteredActivities = activities.filter((activity) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        activity.title.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower) ||
        activity.user.name.toLowerCase().includes(searchLower) ||
        activity.metadata?.patientName?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && activity.type !== typeFilter) return false;

    // Status filter
    if (statusFilter !== 'all' && activity.status !== statusFilter) return false;

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const activityDate = activity.timestamp;
      const diffMs = now.getTime() - activityDate.getTime();
      
      switch (timeFilter) {
        case 'today':
          if (diffMs > 24 * 60 * 60 * 1000) return false;
          break;
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
    setTimeFilter('all');
  };

  return (
    <div className={twMerge(clsx('bg-white rounded-lg border border-gray-200', className))}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2">
            {showRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={clsx(
                  'p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100',
                  isRefreshing && 'animate-spin'
                )}
                title="Refresh activities"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            )}
            {showExport && (
              <button
                onClick={onExport}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                title="Export activities"
              >
                <Download className="h-5 w-5" />
              </button>
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
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Filter Controls */}
            {showFilters && (
              <div className="flex flex-wrap gap-4">
                {/* Type Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as ActivityTypeFilter)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="appointment">Appointments</option>
                    <option value="patient">Patients</option>
                    <option value="medication">Medications</option>
                    <option value="alert">Alerts</option>
                    <option value="system">System</option>
                  </select>
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ActivityStatusFilter)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="info">Info</option>
                </select>

                {/* Time Filter */}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || timeFilter !== 'all') && (
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

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredActivities.length} of {activities.length} activities
        </div>
      </div>

      {/* Activities List */}
      <div className="divide-y divide-gray-100">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onClick={onActivityClick}
              showChevron={!!onActivityClick}
            />
          ))
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-sm">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || timeFilter !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'No activities to display at this time'}
            </p>
            {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || timeFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
