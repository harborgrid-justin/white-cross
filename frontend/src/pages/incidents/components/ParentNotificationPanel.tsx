/**
 * ParentNotificationPanel Component
 *
 * Comprehensive panel displaying parent notification status and management for incidents.
 * Provides overview of notification delivery status and actions to send/resend notifications.
 *
 * @module pages/incidents/components/ParentNotificationPanel
 */

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/buttons/Button';
import { Alert } from '@/components/ui/feedback/Alert';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import { Badge } from '@/components/ui/display/Badge';
import NotificationStatus, { NotificationStatusType } from './NotificationStatus';
import SendNotificationDialog, {
  NotificationRecipient,
  NotificationFormData
} from './SendNotificationDialog';
import NotificationHistory, { NotificationRecord } from './NotificationHistory';
import {
  Bell,
  Send,
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ParentNotificationMethod } from '@/types/incidents';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

/**
 * Overall notification summary for an incident
 */
export interface NotificationSummary {
  totalSent: number;
  delivered: number;
  failed: number;
  pending: number;
  lastSentAt?: string;
  parentNotified: boolean;
  notificationMethods?: ParentNotificationMethod[];
}

/**
 * Props for ParentNotificationPanel component
 */
export interface ParentNotificationPanelProps {
  /** Incident ID */
  incidentId: string;
  /** Notification summary statistics */
  summary?: NotificationSummary;
  /** Available recipients for notifications */
  recipients?: NotificationRecipient[];
  /** Notification history records */
  notifications?: NotificationRecord[];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Callback to send notification */
  onSendNotification?: (data: NotificationFormData) => Promise<void>;
  /** Callback to retry failed notification */
  onRetryNotification?: (notificationId: string) => void;
  /** Callback to export notification history */
  onExportHistory?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get method icon
 */
const getMethodIcon = (method: ParentNotificationMethod) => {
  switch (method) {
    case ParentNotificationMethod.EMAIL:
      return Mail;
    case ParentNotificationMethod.SMS:
      return MessageSquare;
    case ParentNotificationMethod.VOICE:
      return Phone;
    default:
      return Bell;
  }
};

/**
 * Get method label
 */
const getMethodLabel = (method: ParentNotificationMethod): string => {
  switch (method) {
    case ParentNotificationMethod.EMAIL:
      return 'Email';
    case ParentNotificationMethod.SMS:
      return 'SMS';
    case ParentNotificationMethod.VOICE:
      return 'Voice';
    case ParentNotificationMethod.IN_PERSON:
      return 'In Person';
    case ParentNotificationMethod.AUTO_NOTIFICATION:
      return 'Auto';
    default:
      return String(method);
  }
};

/**
 * ParentNotificationPanel - Display parent notification status and management
 *
 * Central panel for viewing and managing parent notifications for an incident.
 * Shows notification status summary, delivery statistics, and provides actions
 * to send or resend notifications.
 *
 * **Features:**
 * - Notification status summary with statistics
 * - Recent notification display
 * - Send/resend notification actions
 * - Expandable notification history
 * - Delivery status indicators
 * - Method-based filtering
 * - Export capabilities
 * - HIPAA-compliant audit trail
 * - Responsive design
 *
 * @component
 * @param {ParentNotificationPanelProps} props - Component props
 * @returns {JSX.Element} Rendered notification panel
 *
 * @example
 * ```tsx
 * <ParentNotificationPanel
 *   incidentId="incident-123"
 *   summary={notificationSummary}
 *   recipients={recipients}
 *   notifications={notifications}
 *   onSendNotification={handleSend}
 * />
 * ```
 */
export const ParentNotificationPanel: React.FC<ParentNotificationPanelProps> = ({
  incidentId,
  summary,
  recipients = [],
  notifications = [],
  isLoading = false,
  error = null,
  onSendNotification,
  onRetryNotification,
  onExportHistory,
  className
}) => {
  // State
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);

  /**
   * Handle sending notification
   */
  const handleSendNotification = async (data: NotificationFormData) => {
    if (!onSendNotification) {
      console.warn('No onSendNotification handler provided');
      return;
    }

    setIsSending(true);
    try {
      await onSendNotification(data);
      setShowSendDialog(false);
    } catch (err) {
      console.error('Failed to send notification:', err);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Format timestamp
   */
  const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return 'Never';
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  /**
   * Get overall notification status
   */
  const getOverallStatus = (): {
    status: NotificationStatusType;
    message: string;
    variant: 'success' | 'warning' | 'error' | 'info';
  } => {
    if (!summary || summary.totalSent === 0) {
      return {
        status: 'PENDING',
        message: 'No notifications sent yet',
        variant: 'warning'
      };
    }

    if (summary.failed > 0) {
      return {
        status: 'FAILED',
        message: `${summary.failed} notification${summary.failed !== 1 ? 's' : ''} failed`,
        variant: 'error'
      };
    }

    if (summary.pending > 0) {
      return {
        status: 'PENDING',
        message: `${summary.pending} notification${summary.pending !== 1 ? 's' : ''} pending`,
        variant: 'info'
      };
    }

    if (summary.delivered === summary.totalSent) {
      return {
        status: 'DELIVERED',
        message: 'All notifications delivered successfully',
        variant: 'success'
      };
    }

    return {
      status: 'SENT',
      message: 'Notifications sent',
      variant: 'info'
    };
  };

  const overallStatus = getOverallStatus();

  /**
   * Get recent notifications (last 3)
   */
  const recentNotifications = notifications.slice(0, 3);

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
          <Alert variant="error" title="Error Loading Notifications">
            {error.message || 'Failed to load notification information.'}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn('parent-notification-panel', className)}>
        {/* Header */}
        <CardHeader divider>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Parent Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notification delivery status and management
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSendDialog(true)}
              disabled={recipients.length === 0}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </div>
        </CardHeader>

        {/* Status Summary */}
        <CardContent className="py-4">
          {/* Overall Status */}
          <div
            className={cn(
              'flex items-center justify-between p-4 rounded-lg border-2 mb-4',
              overallStatus.variant === 'success' &&
                'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800',
              overallStatus.variant === 'warning' &&
                'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800',
              overallStatus.variant === 'error' &&
                'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800',
              overallStatus.variant === 'info' &&
                'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800'
            )}
          >
            <div className="flex items-center gap-3">
              {overallStatus.variant === 'success' && (
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              )}
              {overallStatus.variant === 'warning' && (
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              )}
              {overallStatus.variant === 'error' && (
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
              {overallStatus.variant === 'info' && (
                <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              )}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {overallStatus.message}
                </div>
                {summary?.lastSentAt && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Last sent: {formatTimestamp(summary.lastSentAt)}
                  </div>
                )}
              </div>
            </div>

            <NotificationStatus status={overallStatus.status} size="lg" />
          </div>

          {/* Statistics Grid */}
          {summary && summary.totalSent > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summary.totalSent}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Sent</div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {summary.delivered}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Delivered</div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {summary.pending}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {summary.failed}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Failed</div>
              </div>
            </div>
          )}

          {/* Notification Methods Used */}
          {summary?.notificationMethods && summary.notificationMethods.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Methods used:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {summary.notificationMethods.map((method) => {
                  const Icon = getMethodIcon(method);
                  return (
                    <Badge
                      key={method}
                      variant="info"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Icon className="h-3 w-3" />
                      {getMethodLabel(method)}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Notifications */}
          {recentNotifications.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Recent Notifications
                </h4>
                {notifications.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullHistory(!showFullHistory)}
                  >
                    <History className="h-4 w-4 mr-1" />
                    {showFullHistory ? 'Hide' : 'View All'} ({notifications.length})
                    {showFullHistory ? (
                      <ChevronUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {recentNotifications.map((notification) => {
                  const MethodIcon = getMethodIcon(notification.method);
                  return (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <MethodIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {notification.recipient.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {notification.sentAt && formatTimestamp(notification.sentAt)}
                          </div>
                        </div>
                      </div>
                      <NotificationStatus status={notification.status} size="sm" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Notifications State */}
          {notifications.length === 0 && (
            <div className="text-center py-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-3">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No notifications have been sent for this incident.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowSendDialog(true)}
                disabled={recipients.length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Send First Notification
              </Button>
            </div>
          )}
        </CardContent>

        {/* Full History (Expandable) */}
        {showFullHistory && notifications.length > 3 && (
          <CardContent className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <NotificationHistory
              incidentId={incidentId}
              notifications={notifications}
              onRetry={onRetryNotification}
              onExport={onExportHistory}
            />
          </CardContent>
        )}

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <CardFooter divider className="bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {recipients.length} recipient{recipients.length !== 1 ? 's' : ''} available
              </div>
              <div className="flex items-center gap-2">
                {summary?.failed > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSendDialog(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Resend Failed
                  </Button>
                )}
              </div>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Send Notification Dialog */}
      <SendNotificationDialog
        isOpen={showSendDialog}
        onClose={() => setShowSendDialog(false)}
        incidentId={incidentId}
        recipients={recipients}
        isLoading={isSending}
        onSend={handleSendNotification}
        onSuccess={() => {
          // Dialog will close automatically
        }}
      />
    </>
  );
};

ParentNotificationPanel.displayName = 'ParentNotificationPanel';

export default React.memo(ParentNotificationPanel);
