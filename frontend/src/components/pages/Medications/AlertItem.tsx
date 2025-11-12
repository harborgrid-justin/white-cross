/**
 * AlertItem Component
 *
 * Displays an individual medication alert with:
 * - Selection checkbox
 * - Alert type icon and styling
 * - Priority badge
 * - Alert details (title, message, metadata)
 * - Action buttons (acknowledge, take action, dismiss)
 * - Acknowledgment information if applicable
 */

import React from 'react';
import type { AlertItemProps } from './medicationAlerts.types';
import { getAlertTypeConfig, getPriorityBadge } from './medicationAlerts.utils';

/**
 * AlertItem component displays a single medication alert
 *
 * @param props - Component props
 * @returns JSX element representing a single alert
 */
export function AlertItem({
  alert,
  isSelected,
  onToggleSelection,
  onAcknowledge,
  onDismiss,
  onTakeAction
}: AlertItemProps) {
  const typeConfig = getAlertTypeConfig(alert.type);

  return (
    <div
      className={`p-6 hover:bg-gray-50 ${alert.acknowledged ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start space-x-4">
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelection(alert.id)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          aria-label={`Select alert: ${alert.title}`}
        />

        {/* Alert Type Icon */}
        <div className={`flex-shrink-0 w-10 h-10 ${typeConfig.bgColor} rounded-md flex items-center justify-center border ${typeConfig.borderColor}`}>
          <div className={typeConfig.iconColor}>
            {typeConfig.icon}
          </div>
        </div>

        {/* Alert Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Title and Badges */}
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {alert.title}
                </h4>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityBadge(alert.priority)}`}>
                  {alert.priority}
                </span>
                {alert.acknowledged && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                    Acknowledged
                  </span>
                )}
                {alert.actionRequired && !alert.actionTaken && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                    Action Required
                  </span>
                )}
              </div>

              {/* Message */}
              <p className="mt-1 text-sm text-gray-600">{alert.message}</p>

              {/* Metadata */}
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span>Type: {alert.type.replace('-', ' ')}</span>
                {alert.medicationName && (
                  <span>Medication: {alert.medicationName}</span>
                )}
                {alert.studentName && (
                  <span>Student: {alert.studentName}</span>
                )}
                <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
              </div>

              {/* Acknowledgment Info */}
              {alert.acknowledged && alert.acknowledgedBy && (
                <div className="mt-2 text-xs text-gray-500">
                  Acknowledged by {alert.acknowledgedBy} on {new Date(alert.acknowledgedAt!).toLocaleString()}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              {!alert.acknowledged && (
                <button
                  onClick={() => onAcknowledge?.(alert.id)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                  aria-label={`Acknowledge alert: ${alert.title}`}
                >
                  Acknowledge
                </button>
              )}
              {alert.actionRequired && !alert.actionTaken && (
                <button
                  onClick={() => onTakeAction?.(alert.id, 'resolve')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  aria-label={`Take action on alert: ${alert.title}`}
                >
                  Take Action
                </button>
              )}
              <button
                onClick={() => onDismiss?.(alert.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                aria-label={`Dismiss alert: ${alert.title}`}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertItem;
