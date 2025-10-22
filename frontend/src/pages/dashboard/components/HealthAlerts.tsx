import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Calendar,
  Bell,
  BellOff,
  Eye,
  X
} from 'lucide-react';

// Types
export interface HealthAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  source: 'system' | 'lab' | 'medication' | 'appointment' | 'vitals' | 'manual';
  patientId?: string;
  patientName?: string;
  timestamp: Date;
  isRead: boolean;
  isAcknowledged: boolean;
  isDismissed: boolean;
  expiresAt?: Date;
  actionRequired: boolean;
  category: 'lab-results' | 'vital-signs' | 'medication' | 'appointment' | 'system' | 'other';
  metadata?: {
    labValue?: string;
    normalRange?: string;
    medicationName?: string;
    appointmentTime?: string;
    department?: string;
  };
}

interface HealthAlertsProps {
  className?: string;
  alerts?: HealthAlert[];
  maxItems?: number;
  showActions?: boolean;
  onAlertClick?: (alert: HealthAlert) => void;
  onMarkAsRead?: (alertId: string) => void;
  onAcknowledge?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  onViewAll?: () => void;
}

// Mock alerts data
const generateMockAlerts = (): HealthAlert[] => [
  {
    id: '1',
    type: 'critical',
    severity: 'critical',
    title: 'Critical Lab Result',
    message: 'Glucose level of 450 mg/dL detected - immediate intervention required',
    source: 'lab',
    patientId: 'P-2024-001',
    patientName: 'James Miller',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    isRead: false,
    isAcknowledged: false,
    isDismissed: false,
    actionRequired: true,
    category: 'lab-results',
    metadata: {
      labValue: '450 mg/dL',
      normalRange: '70-99 mg/dL',
      department: 'Laboratory',
    },
  },
  {
    id: '2',
    type: 'warning',
    severity: 'high',
    title: 'Blood Pressure Alert',
    message: 'Patient shows consistently elevated blood pressure readings',
    source: 'vitals',
    patientId: 'P-2024-002',
    patientName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 32 * 60 * 1000), // 32 minutes ago
    isRead: false,
    isAcknowledged: false,
    isDismissed: false,
    actionRequired: true,
    category: 'vital-signs',
    metadata: {
      labValue: '180/110 mmHg',
      normalRange: '<120/80 mmHg',
    },
  },
  {
    id: '3',
    type: 'warning',
    severity: 'medium',
    title: 'Medication Interaction',
    message: 'Potential drug interaction detected between prescribed medications',
    source: 'medication',
    patientId: 'P-2024-003',
    patientName: 'Robert Davis',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    isRead: true,
    isAcknowledged: false,
    isDismissed: false,
    actionRequired: true,
    category: 'medication',
    metadata: {
      medicationName: 'Warfarin + Aspirin',
      department: 'Pharmacy',
    },
  },
  {
    id: '4',
    type: 'info',
    severity: 'low',
    title: 'Appointment Reminder',
    message: 'Patient has upcoming appointment in 2 hours',
    source: 'appointment',
    patientId: 'P-2024-004',
    patientName: 'Maria Garcia',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    isRead: true,
    isAcknowledged: true,
    isDismissed: false,
    actionRequired: false,
    category: 'appointment',
    metadata: {
      appointmentTime: '2:30 PM',
      department: 'Cardiology',
    },
  },
  {
    id: '5',
    type: 'success',
    severity: 'low',
    title: 'Lab Results Normal',
    message: 'All routine lab results are within normal ranges',
    source: 'lab',
    patientId: 'P-2024-005',
    patientName: 'David Thompson',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
    isAcknowledged: true,
    isDismissed: false,
    actionRequired: false,
    category: 'lab-results',
  },
  {
    id: '6',
    type: 'warning',
    severity: 'medium',
    title: 'System Maintenance',
    message: 'Scheduled system maintenance will begin in 30 minutes',
    source: 'system',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    isRead: false,
    isAcknowledged: false,
    isDismissed: false,
    actionRequired: false,
    category: 'system',
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // Expires in 30 minutes
  },
];

const getAlertIcon = (type: HealthAlert['type'], severity: HealthAlert['severity']) => {
  switch (type) {
    case 'critical':
      return AlertTriangle;
    case 'warning':
      return AlertCircle;
    case 'info':
      return Info;
    case 'success':
      return CheckCircle;
    default:
      return AlertCircle;
  }
};

const getAlertColors = (type: HealthAlert['type'], severity: HealthAlert['severity']) => {
  if (type === 'critical' || severity === 'critical') {
    return {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-700',
      badge: 'bg-red-100 text-red-800',
    };
  }
  
  switch (type) {
    case 'warning':
      return severity === 'high'
        ? {
            bg: 'bg-orange-50 border-orange-200',
            icon: 'text-orange-600',
            title: 'text-orange-900',
            message: 'text-orange-700',
            badge: 'bg-orange-100 text-orange-800',
          }
        : {
            bg: 'bg-yellow-50 border-yellow-200',
            icon: 'text-yellow-600',
            title: 'text-yellow-900',
            message: 'text-yellow-700',
            badge: 'bg-yellow-100 text-yellow-800',
          };
    case 'info':
      return {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-900',
        message: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-800',
      };
    case 'success':
      return {
        bg: 'bg-green-50 border-green-200',
        icon: 'text-green-600',
        title: 'text-green-900',
        message: 'text-green-700',
        badge: 'bg-green-100 text-green-800',
      };
    default:
      return {
        bg: 'bg-gray-50 border-gray-200',
        icon: 'text-gray-600',
        title: 'text-gray-900',
        message: 'text-gray-700',
        badge: 'bg-gray-100 text-gray-800',
      };
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

const HealthAlerts: React.FC<HealthAlertsProps> = ({
  className,
  alerts = generateMockAlerts(),
  maxItems = 6,
  showActions = true,
  onAlertClick,
  onMarkAsRead,
  onAcknowledge,
  onDismiss,
  onViewAll,
}) => {
  // Filter out dismissed alerts and sort by severity and timestamp
  const activeAlerts = alerts
    .filter(alert => !alert.isDismissed)
    .sort((a, b) => {
      // Sort by severity first
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aSeverity = severityOrder[a.severity];
      const bSeverity = severityOrder[b.severity];
      
      if (aSeverity !== bSeverity) {
        return bSeverity - aSeverity;
      }
      
      // Then by timestamp (newest first)
      return b.timestamp.getTime() - a.timestamp.getTime();
    })
    .slice(0, maxItems);

  const unreadCount = activeAlerts.filter(alert => !alert.isRead).length;
  const criticalCount = activeAlerts.filter(alert => 
    alert.type === 'critical' || alert.severity === 'critical'
  ).length;

  return (
    <div className={twMerge(clsx('bg-white rounded-lg border border-gray-200', className))}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">Health Alerts</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
            {criticalCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                {criticalCount} critical
              </span>
            )}
          </div>
          
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-gray-100">
        {activeAlerts.length > 0 ? (
          activeAlerts.map((alert) => {
            const IconComponent = getAlertIcon(alert.type, alert.severity);
            const colors = getAlertColors(alert.type, alert.severity);

            return (
              <div
                key={alert.id}
                className={clsx(
                  'p-4 border-l-4 transition-colors duration-150',
                  colors.bg,
                  !alert.isRead && 'bg-opacity-80',
                  onAlertClick && 'cursor-pointer hover:bg-opacity-60'
                )}
                onClick={() => onAlertClick?.(alert)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Icon */}
                    <div className={clsx('flex-shrink-0 mt-0.5', colors.icon)}>
                      <IconComponent className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={clsx(
                          'text-sm font-medium truncate',
                          colors.title,
                          !alert.isRead && 'font-semibold'
                        )}>
                          {alert.title}
                        </h4>
                        
                        {/* Status Indicators */}
                        <div className="flex items-center space-x-1 ml-2">
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" title="Unread" />
                          )}
                          {alert.actionRequired && (
                            <Bell className="h-3 w-3 text-orange-500" />
                          )}
                        </div>
                      </div>

                      <p className={clsx('text-sm mb-2', colors.message)}>
                        {alert.message}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {alert.patientName && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <User className="h-3 w-3 mr-1" />
                            {alert.patientName}
                          </span>
                        )}
                        {alert.metadata?.department && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {alert.metadata.department}
                          </span>
                        )}
                        <span className={clsx(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          colors.badge
                        )}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>

                      {/* Lab Values */}
                      {alert.metadata?.labValue && (
                        <div className="text-xs text-gray-600 mb-2">
                          <strong>Value:</strong> {alert.metadata.labValue}
                          {alert.metadata.normalRange && (
                            <span className="ml-2">
                              <strong>Normal:</strong> {alert.metadata.normalRange}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatTimestamp(alert.timestamp)}</span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{alert.source}</span>
                        </div>

                        {/* Action Buttons */}
                        {showActions && (
                          <div className="flex items-center space-x-2">
                            {!alert.isRead && onMarkAsRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead(alert.id);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                title="Mark as read"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
                            )}
                            {alert.actionRequired && !alert.isAcknowledged && onAcknowledge && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAcknowledge(alert.id);
                                }}
                                className="text-xs text-green-600 hover:text-green-700 font-medium"
                                title="Acknowledge"
                              >
                                Ack
                              </button>
                            )}
                            {onDismiss && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDismiss(alert.id);
                                }}
                                className="text-xs text-gray-400 hover:text-gray-600"
                                title="Dismiss"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">All Clear</h4>
            <p className="text-sm">No active health alerts at this time</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {alerts.length > maxItems && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onViewAll}
            className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            View {alerts.length - maxItems} more alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthAlerts;
