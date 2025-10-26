/**
 * NotificationHistory Component
 *
 * Comprehensive notification history timeline for incident parent notifications.
 * Displays all notification attempts with filtering, sorting, and retry capabilities.
 *
 * @module pages/incidents/components/NotificationHistory
 */

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/buttons/Button';
import { SearchInput } from '@/components/ui/inputs/SearchInput';
import { Select } from '@/components/ui/inputs/Select';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import { Alert } from '@/components/ui/feedback/Alert';
import NotificationStatus, { NotificationStatusType } from './NotificationStatus';
import {
  Mail,
  MessageSquare,
  Phone,
  User,
  Download,
  RefreshCw,
  Filter,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ParentNotificationMethod } from '@/types/incidents';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

/**
 * Individual notification record
 */
export interface NotificationRecord {
  id: string;
  method: ParentNotificationMethod;
  status: NotificationStatusType;
  recipient: {
    name: string;
    contact: string; // Email or phone number
    relationship?: string; // Parent, Guardian, etc.
  };
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failureReason?: string;
  message?: string;
  sentBy?: {
    id: string;
    name: string;
  };
  retryCount?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Props for NotificationHistory component
 */
export interface NotificationHistoryProps {
  /** Incident ID to fetch notifications for */
  incidentId: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Notification records */
  notifications?: NotificationRecord[];
  /** Callback when retrying failed notification */
  onRetry?: (notificationId: string) => void;
  /** Callback when exporting history */
  onExport?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get icon for notification method
 */
const getMethodIcon = (method: ParentNotificationMethod) => {
  switch (method) {
    case ParentNotificationMethod.EMAIL:
      return Mail;
    case ParentNotificationMethod.SMS:
      return MessageSquare;
    case ParentNotificationMethod.VOICE:
      return Phone;
    case ParentNotificationMethod.IN_PERSON:
      return User;
    default:
      return Mail;
  }
};

/**
 * Get label for notification method
 */
const getMethodLabel = (method: ParentNotificationMethod): string => {
  switch (method) {
    case ParentNotificationMethod.EMAIL:
      return 'Email';
    case ParentNotificationMethod.SMS:
      return 'SMS';
    case ParentNotificationMethod.VOICE:
      return 'Voice Call';
    case ParentNotificationMethod.IN_PERSON:
      return 'In Person';
    case ParentNotificationMethod.AUTO_NOTIFICATION:
      return 'Auto Notification';
    default:
      return String(method);
  }
};

/**
 * NotificationHistory - Display complete notification history with filtering
 *
 * Full-featured notification history component that displays a timeline of all
 * notification attempts for an incident. Supports filtering, sorting, and retry.
 *
 * **Features:**
 * - Timeline view of all notifications
 * - Filter by status, method, recipient
 * - Search notifications
 * - Retry failed notifications
 * - Export history to CSV/PDF
 * - Expandable details for each notification
 * - Delivery timestamps and metadata
 * - HIPAA-compliant audit trail
 *
 * @component
 * @param {NotificationHistoryProps} props - Component props
 * @returns {JSX.Element} Rendered notification history
 *
 * @example
 * ```tsx
 * <NotificationHistory
 *   incidentId="incident-123"
 *   notifications={notifications}
 *   onRetry={(id) => handleRetry(id)}
 *   onExport={() => handleExport()}
 * />
 * ```
 */
export const NotificationHistory: React.FC<NotificationHistoryProps> = ({
  incidentId,
  isLoading = false,
  error = null,
  notifications = [],
  onRetry,
  onExport,
  className
}) => {
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<NotificationStatusType | 'ALL'>('ALL');
  const [methodFilter, setMethodFilter] = useState<ParentNotificationMethod | 'ALL'>('ALL');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  /**
   * Toggle expanded state for notification
   */
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  /**
   * Filter and search notifications
   */
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((n) => n.status === statusFilter);
    }

    // Apply method filter
    if (methodFilter !== 'ALL') {
      filtered = filtered.filter((n) => n.method === methodFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.recipient.name.toLowerCase().includes(query) ||
          n.recipient.contact.toLowerCase().includes(query) ||
          n.recipient.relationship?.toLowerCase().includes(query)
      );
    }

    // Sort by sent date (most recent first)
    filtered.sort((a, b) => {
      const dateA = a.sentAt ? new Date(a.sentAt).getTime() : 0;
      const dateB = b.sentAt ? new Date(b.sentAt).getTime() : 0;
      return dateB - dateA;
    });

    return filtered;
  }, [notifications, statusFilter, methodFilter, searchQuery]);

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return 'N/A';
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch {
      return 'Invalid date';
    }
  };

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-6">
          <Alert variant="error" title="Error Loading Notification History">
            {error.message || 'Failed to load notification history. Please try again.'}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('notification-history', className)}>
      {/* Header */}
      <CardHeader divider>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notification History
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''} sent
            </p>
          </div>

          {onExport && notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              aria-label="Export notification history"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Filters */}
      <CardContent className="border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipient..."
            className="w-full"
          />

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as NotificationStatusType | 'ALL')}
            className="w-full"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="SENT">Sent</option>
            <option value="DELIVERED">Delivered</option>
            <option value="FAILED">Failed</option>
            <option value="READ">Read</option>
          </Select>

          {/* Method Filter */}
          <Select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as ParentNotificationMethod | 'ALL')}
            className="w-full"
          >
            <option value="ALL">All Methods</option>
            <option value={ParentNotificationMethod.EMAIL}>Email</option>
            <option value={ParentNotificationMethod.SMS}>SMS</option>
            <option value={ParentNotificationMethod.VOICE}>Voice Call</option>
            <option value={ParentNotificationMethod.IN_PERSON}>In Person</option>
          </Select>
        </div>
      </CardContent>

      {/* Notification List */}
      <CardContent className="p-0">
        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="No Notifications Found"
            message={
              searchQuery || statusFilter !== 'ALL' || methodFilter !== 'ALL'
                ? 'No notifications match your filters. Try adjusting the filters.'
                : 'No notifications have been sent for this incident yet.'
            }
            className="py-12"
          />
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.map((notification) => {
              const MethodIcon = getMethodIcon(notification.method);
              const isExpanded = expandedIds.has(notification.id);
              const canRetry = notification.status === 'FAILED' && onRetry;

              return (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Main notification row */}
                  <div className="flex items-start justify-between gap-4">
                    {/* Left side - Method icon and details */}
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full
                                   bg-gray-100 dark:bg-gray-800 flex-shrink-0"
                      >
                        <MethodIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {notification.recipient.name}
                          </span>
                          {notification.recipient.relationship && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({notification.recipient.relationship})
                            </span>
                          )}
                          <NotificationStatus status={notification.status} size="sm" />
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MethodIcon className="h-3.5 w-3.5" />
                            {getMethodLabel(notification.method)}
                          </span>
                          <span>•</span>
                          <span>{notification.recipient.contact}</span>
                          {notification.sentAt && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatTimestamp(notification.sentAt)}
                              </span>
                            </>
                          )}
                        </div>

                        {notification.failureReason && (
                          <div className="mt-2">
                            <Alert variant="error" size="sm" className="text-sm">
                              {notification.failureReason}
                            </Alert>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {canRetry && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRetry(notification.id)}
                          aria-label="Retry notification"
                          title="Retry sending notification"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(notification.id)}
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 ml-13 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {notification.sentBy && (
                          <>
                            <dt className="font-medium text-gray-700 dark:text-gray-300">
                              Sent By:
                            </dt>
                            <dd className="text-gray-600 dark:text-gray-400">
                              {notification.sentBy.name}
                            </dd>
                          </>
                        )}

                        {notification.deliveredAt && (
                          <>
                            <dt className="font-medium text-gray-700 dark:text-gray-300">
                              Delivered At:
                            </dt>
                            <dd className="text-gray-600 dark:text-gray-400">
                              {formatTimestamp(notification.deliveredAt)}
                            </dd>
                          </>
                        )}

                        {notification.readAt && (
                          <>
                            <dt className="font-medium text-gray-700 dark:text-gray-300">
                              Read At:
                            </dt>
                            <dd className="text-gray-600 dark:text-gray-400">
                              {formatTimestamp(notification.readAt)}
                            </dd>
                          </>
                        )}

                        {notification.retryCount !== undefined && notification.retryCount > 0 && (
                          <>
                            <dt className="font-medium text-gray-700 dark:text-gray-300">
                              Retry Attempts:
                            </dt>
                            <dd className="text-gray-600 dark:text-gray-400">
                              {notification.retryCount}
                            </dd>
                          </>
                        )}

                        {notification.message && (
                          <>
                            <dt className="font-medium text-gray-700 dark:text-gray-300 md:col-span-2">
                              Message:
                            </dt>
                            <dd className="text-gray-600 dark:text-gray-400 md:col-span-2">
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 whitespace-pre-wrap">
                                {notification.message}
                              </div>
                            </dd>
                          </>
                        )}
                      </dl>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Footer with summary stats */}
      {notifications.length > 0 && (
        <CardFooter divider className="bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div>
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
            {filteredNotifications.length < notifications.length && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setMethodFilter('ALL');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

NotificationHistory.displayName = 'NotificationHistory';

export default React.memo(NotificationHistory);
