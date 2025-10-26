import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Clock, User, Calendar, FileText, AlertCircle, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Activity } from './RecentActivities';

interface ActivityItemProps {
  activity: Activity;
  className?: string;
  showChevron?: boolean;
  compact?: boolean;
  onClick?: (activity: Activity) => void;
}

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
      return 'text-green-600 bg-green-50';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50';
    case 'error':
      return 'text-red-600 bg-red-50';
    case 'info':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIndicator = (status: Activity['status']) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'info':
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return null;
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
  if (diffDays < 7) return `${diffDays}d ago`;
  
  // For older items, show actual date
  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: timestamp.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  className,
  showChevron = false,
  compact = false,
  onClick,
}) => {
  const IconComponent = getActivityIcon(activity.type);
  const statusColors = getStatusColor(activity.status);
  const statusIndicator = getStatusIndicator(activity.status);

  const handleClick = () => {
    onClick?.(activity);
  };

  return (
    <div
      className={twMerge(
        clsx(
          'flex items-start space-x-3 hover:bg-gray-50 transition-colors duration-150',
          compact ? 'p-3' : 'p-4',
          onClick && 'cursor-pointer',
          className
        )
      )}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Activity Icon */}
      <div className={clsx('flex-shrink-0 p-2 rounded-full', statusColors)}>
        <IconComponent className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
      </div>

      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Title and Description */}
            <div className="space-y-1">
              <h4 className={clsx(
                'font-medium text-gray-900 truncate',
                compact ? 'text-sm' : 'text-base'
              )}>
                {activity.title}
              </h4>
              {!compact && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {activity.description}
                </p>
              )}
            </div>

            {/* Metadata Tags */}
            {activity.metadata && !compact && (
              <div className="flex flex-wrap gap-1 mt-2">
                {activity.metadata.patientName && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <User className="h-3 w-3 mr-1" />
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
                    <Calendar className="h-3 w-3 mr-1" />
                    {activity.metadata.appointmentTime}
                  </span>
                )}
                {activity.metadata.medicationName && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <FileText className="h-3 w-3 mr-1" />
                    {activity.metadata.medicationName}
                  </span>
                )}
              </div>
            )}

            {/* User Info and Timestamp */}
            <div className={clsx(
              'flex items-center text-gray-500',
              compact ? 'text-xs mt-1' : 'text-sm mt-2'
            )}>
              <span className="font-medium">{activity.user.name}</span>
              <span className="mx-1">•</span>
              <span>{activity.user.role}</span>
              <span className="mx-1">•</span>
              <span>{formatTimestamp(activity.timestamp)}</span>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="flex items-center space-x-2 ml-3">
            {/* Status Indicator */}
            {statusIndicator && (
              <div className="flex-shrink-0">
                {statusIndicator}
              </div>
            )}

            {/* Chevron for navigation */}
            {showChevron && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
