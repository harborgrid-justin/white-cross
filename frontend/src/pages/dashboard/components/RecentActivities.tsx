import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Clock, User, Calendar, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Types
export interface Activity {
  id: string;
  type: 'appointment' | 'patient' | 'medication' | 'alert' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: {
    patientName?: string;
    appointmentTime?: string;
    medicationName?: string;
    department?: string;
  };
}

interface RecentActivitiesProps {
  className?: string;
  activities?: Activity[];
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  onActivityClick?: (activity: Activity) => void;
}

// Mock activities data
const generateMockActivities = (): Activity[] => [
  {
    id: '1',
    type: 'appointment',
    title: 'New Appointment Scheduled',
    description: 'Dr. Smith scheduled appointment with Sarah Johnson',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    user: {
      name: 'Dr. Michael Smith',
      role: 'Cardiologist',
    },
    status: 'success',
    metadata: {
      patientName: 'Sarah Johnson',
      appointmentTime: '2:30 PM',
      department: 'Cardiology',
    },
  },
  {
    id: '2',
    type: 'patient',
    title: 'Patient Check-in',
    description: 'Robert Davis checked in for consultation',
    timestamp: new Date(Date.now() - 32 * 60 * 1000), // 32 minutes ago
    user: {
      name: 'Emma Wilson',
      role: 'Receptionist',
    },
    status: 'info',
    metadata: {
      patientName: 'Robert Davis',
      department: 'General Medicine',
    },
  },
  {
    id: '3',
    type: 'medication',
    title: 'Medication Prescribed',
    description: 'Prescribed Lisinopril 10mg to Maria Garcia',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    user: {
      name: 'Dr. Jennifer Lee',
      role: 'Internal Medicine',
    },
    status: 'success',
    metadata: {
      patientName: 'Maria Garcia',
      medicationName: 'Lisinopril 10mg',
    },
  },
  {
    id: '4',
    type: 'alert',
    title: 'Critical Lab Result',
    description: 'Abnormal glucose levels detected for James Miller',
    timestamp: new Date(Date.now() - 78 * 60 * 1000), // 1 hour 18 minutes ago
    user: {
      name: 'Lab System',
      role: 'Automated Alert',
    },
    status: 'warning',
    metadata: {
      patientName: 'James Miller',
      department: 'Laboratory',
    },
  },
  {
    id: '5',
    type: 'system',
    title: 'System Maintenance',
    description: 'Scheduled maintenance completed successfully',
    timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
    user: {
      name: 'System Admin',
      role: 'IT Department',
    },
    status: 'success',
  },
  {
    id: '6',
    type: 'appointment',
    title: 'Appointment Cancelled',
    description: 'Patient cancelled appointment for next week',
    timestamp: new Date(Date.now() - 185 * 60 * 1000), // 3+ hours ago
    user: {
      name: 'Lisa Chen',
      role: 'Scheduler',
    },
    status: 'error',
    metadata: {
      patientName: 'David Thompson',
      department: 'Orthopedics',
    },
  },
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'appointment':
      return Calendar;
    case 'patient':
      return User;
    case 'medication':
      return FileText;
    case 'alert':
      return AlertCircle;
    case 'system':
      return CheckCircle;
    default:
      return Clock;
  }
};

const getStatusColor = (status: Activity['status']) => {
  switch (status) {
    case 'success':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'error':
      return 'text-red-600';
    case 'info':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  className,
  activities = generateMockActivities(),
  maxItems = 6,
  showViewAll = true,
  onViewAll,
  onActivityClick,
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className={twMerge(clsx('bg-white rounded-lg border border-gray-200', className))}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          {showViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Activities List */}
      <div className="divide-y divide-gray-100">
        {displayedActivities.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          const statusColor = getStatusColor(activity.status);

          return (
            <div
              key={activity.id}
              className={clsx(
                'p-6 hover:bg-gray-50 transition-colors duration-150',
                onActivityClick && 'cursor-pointer'
              )}
              onClick={() => onActivityClick?.(activity)}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={clsx('flex-shrink-0 p-1', statusColor)}>
                  <IconComponent className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      
                      {/* Metadata */}
                      {activity.metadata && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {activity.metadata.patientName && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {activity.metadata.patientName}
                            </span>
                          )}
                          {activity.metadata.department && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {activity.metadata.department}
                            </span>
                          )}
                          {activity.metadata.appointmentTime && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {activity.metadata.appointmentTime}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* User and Timestamp */}
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>{activity.user.name}</span>
                        <span className="mx-1">•</span>
                        <span>{activity.user.role}</span>
                        <span className="mx-1">•</span>
                        <span>{formatTimestamp(activity.timestamp)}</span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex-shrink-0 ml-2">
                      {activity.status === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {activity.status === 'warning' && (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      {activity.status === 'error' && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      {activity.status === 'info' && (
                        <Clock className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {activities.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No recent activities</p>
        </div>
      )}

      {activities.length > maxItems && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onViewAll}
            className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            View {activities.length - maxItems} more activities
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
