/**
 * AlertsWidget Component - Critical Alerts Display
 *
 * Displays critical alerts and warnings with severity indicators.
 * Features dismissible alerts, action buttons, and real-time updates.
 *
 * @module components/features/dashboard/AlertsWidget
 */

import React, { useCallback, useMemo } from 'react';
import { AlertTriangle, X, CheckCircle, Info, AlertCircle } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: Date | string;
  dismissible?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export interface AlertsWidgetProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
  loading?: boolean;
  darkMode?: boolean;
  className?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

// ============================================================================
// HELPERS
// ============================================================================

const getAlertConfig = (severity: AlertSeverity, darkMode: boolean) => {
  const configs = {
    critical: {
      icon: AlertTriangle,
      bg: darkMode ? 'bg-red-900/20' : 'bg-red-50',
      border: darkMode ? 'border-red-700' : 'border-red-200',
      text: darkMode ? 'text-red-400' : 'text-red-700',
      iconColor: darkMode ? 'text-red-400' : 'text-red-600'
    },
    warning: {
      icon: AlertCircle,
      bg: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
      border: darkMode ? 'border-yellow-700' : 'border-yellow-200',
      text: darkMode ? 'text-yellow-400' : 'text-yellow-700',
      iconColor: darkMode ? 'text-yellow-400' : 'text-yellow-600'
    },
    info: {
      icon: Info,
      bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50',
      border: darkMode ? 'border-blue-700' : 'border-blue-200',
      text: darkMode ? 'text-blue-400' : 'text-blue-700',
      iconColor: darkMode ? 'text-blue-400' : 'text-blue-600'
    },
    success: {
      icon: CheckCircle,
      bg: darkMode ? 'bg-green-900/20' : 'bg-green-50',
      border: darkMode ? 'border-green-700' : 'border-green-200',
      text: darkMode ? 'text-green-400' : 'text-green-700',
      iconColor: darkMode ? 'text-green-400' : 'text-green-600'
    }
  };

  return configs[severity];
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * AlertsWidget Component
 *
 * Features:
 * - Severity indicators (critical, warning, info, success)
 * - Dismissible alerts
 * - Action buttons
 * - Real-time updates
 * - Dark mode support
 * - Loading state
 * - Empty state
 */
export const AlertsWidget = React.memo<AlertsWidgetProps>(({
  alerts,
  onDismiss,
  loading = false,
  darkMode = false,
  className = '',
  maxItems = 5,
  showViewAll = true,
  onViewAll
}) => {
  // Limit displayed alerts
  const displayedAlerts = useMemo(
    () => alerts.slice(0, maxItems),
    [alerts, maxItems]
  );

  // Sort alerts by severity (critical first)
  const sortedAlerts = useMemo(() => {
    const severityOrder: Record<AlertSeverity, number> = {
      critical: 0,
      warning: 1,
      info: 2,
      success: 3
    };

    return [...displayedAlerts].sort((a, b) => {
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [displayedAlerts]);

  // Handle dismiss
  const handleDismiss = useCallback((id: string) => {
    if (onDismiss) {
      onDismiss(id);
    }
  }, [onDismiss]);

  // Theme classes
  const themeClasses = useMemo(() => ({
    container: darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-200'
      : 'bg-white border-gray-200 text-gray-900',
    subtitle: darkMode ? 'text-gray-400' : 'text-gray-600'
  }), [darkMode]);

  return (
    <div
      className={`rounded-lg border shadow-sm ${themeClasses.container} ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Alerts</h3>
            <p className={`text-sm mt-1 ${themeClasses.subtitle}`}>
              {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
            </p>
          </div>
          {alerts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full">
                {alerts.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loading && (
          <div className="p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        )}

        {!loading && sortedAlerts.length === 0 && (
          <div className="p-8 text-center">
            <CheckCircle className={`w-12 h-12 mx-auto mb-3 text-green-500`} />
            <p className="font-medium text-green-600 dark:text-green-400">
              All clear!
            </p>
            <p className={`text-sm mt-1 ${themeClasses.subtitle}`}>
              No active alerts at this time
            </p>
          </div>
        )}

        {!loading && sortedAlerts.map((alert) => {
          const config = getAlertConfig(alert.severity, darkMode);
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`px-6 py-4 border-l-4 ${config.border} ${config.bg} transition-all duration-200`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold ${config.text}`}>
                        {alert.title}
                      </h4>
                      <p className={`text-sm mt-1 ${config.text}`}>
                        {alert.message}
                      </p>
                      {alert.actionLabel && alert.onAction && (
                        <button
                          onClick={alert.onAction}
                          className={`mt-3 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            darkMode
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                              : 'bg-white hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          {alert.actionLabel}
                        </button>
                      )}
                    </div>

                    {/* Dismiss Button */}
                    {alert.dismissible && (
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className={`flex-shrink-0 p-1 rounded-md transition-colors ${
                          darkMode
                            ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                            : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                        }`}
                        aria-label="Dismiss alert"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Footer */}
      {showViewAll && onViewAll && alerts.length > maxItems && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onViewAll}
            className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            View all {alerts.length} alerts
          </button>
        </div>
      )}
    </div>
  );
});

AlertsWidget.displayName = 'AlertsWidget';

export default AlertsWidget;
