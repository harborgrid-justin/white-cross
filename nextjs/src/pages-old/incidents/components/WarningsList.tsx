/**
 * WarningsList Component
 *
 * Display warning messages with yellow/amber styling.
 * Supports expandable details and acknowledgment/dismissal.
 *
 * @module pages/incidents/components/WarningsList
 */

import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight, X, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Alert } from '../../../components/ui/feedback/Alert';
import { Badge } from '../../../components/ui/display/Badge';

/**
 * Individual warning with optional details
 */
export interface Warning {
  /** Unique warning ID */
  id: string;
  /** Warning message */
  message: string;
  /** Optional detailed explanation */
  details?: string;
  /** Warning category/type */
  type?: string;
  /** Whether warning has been acknowledged */
  acknowledged?: boolean;
}

/**
 * Component props
 */
interface WarningsListProps {
  /** Array of warnings */
  warnings: Warning[] | string[];
  /** Optional CSS class name */
  className?: string;
  /** Allow dismissing warnings */
  dismissible?: boolean;
  /** Callback when warning is dismissed */
  onDismiss?: (id: string | number) => void;
  /** Allow acknowledging warnings */
  acknowledgeable?: boolean;
  /** Callback when warning is acknowledged */
  onAcknowledge?: (id: string | number) => void;
  /** Show warning count */
  showCount?: boolean;
  /** Compact mode */
  compact?: boolean;
}

/**
 * WarningsList component - Warning messages with amber styling
 *
 * Features:
 * - Yellow/amber warning styling
 * - Warning icons for visibility
 * - Expandable details for complex warnings
 * - Acknowledge/dismiss functionality
 * - Warning grouping by type
 * - Accessible with ARIA labels
 * - Auto-announcement for screen readers
 *
 * @example
 * ```tsx
 * <WarningsList
 *   warnings={[
 *     { id: '1', message: 'Parent has not been notified', type: 'notification' },
 *     { id: '2', message: 'Incident severity is high but no follow-up required', type: 'followup', details: 'Consider adding follow-up actions for high severity incidents' }
 *   ]}
 *   acknowledgeable
 *   onAcknowledge={(id) => handleAcknowledge(id)}
 * />
 * ```
 */
const WarningsList: React.FC<WarningsListProps> = ({
  warnings,
  className = '',
  dismissible = false,
  onDismiss,
  acknowledgeable = false,
  onAcknowledge,
  showCount = true,
  compact = false,
}) => {
  const [expandedWarnings, setExpandedWarnings] = useState<Set<string>>(new Set());
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string | number>>(new Set());
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState<Set<string | number>>(new Set());

  /**
   * Normalize warnings to Warning objects
   */
  const normalizedWarnings: Warning[] = warnings.map((warning, index) =>
    typeof warning === 'string'
      ? { id: `warning-${index}`, message: warning }
      : warning
  );

  /**
   * Toggle warning details expansion
   */
  const toggleExpand = (id: string) => {
    setExpandedWarnings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  /**
   * Handle warning dismissal
   */
  const handleDismiss = (id: string) => {
    setDismissedWarnings(prev => new Set(prev).add(id));
    if (onDismiss) {
      onDismiss(id);
    }
  };

  /**
   * Handle warning acknowledgment
   */
  const handleAcknowledge = (id: string) => {
    setAcknowledgedWarnings(prev => new Set(prev).add(id));
    if (onAcknowledge) {
      onAcknowledge(id);
    }
  };

  /**
   * Filter active warnings
   */
  const activeWarnings = normalizedWarnings.filter(
    warning => !dismissedWarnings.has(warning.id)
  );

  // Don't render if no active warnings
  if (activeWarnings.length === 0) {
    return null;
  }

  // Group warnings by type if types are present
  const groupedWarnings = activeWarnings.reduce((acc, warning) => {
    const type = warning.type || 'general';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(warning);
    return acc;
  }, {} as Record<string, Warning[]>);

  const hasMultipleTypes = Object.keys(groupedWarnings).length > 1;

  return (
    <Alert
      variant="warning"
      className={cn('warnings-list', className)}
      role="alert"
      aria-live="polite"
    >
      <div className={cn('space-y-3', compact && 'space-y-2')}>
        {/* Header */}
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-900">
              {showCount && activeWarnings.length > 1
                ? `${activeWarnings.length} Warnings`
                : 'Warning'}
            </h3>
            {activeWarnings.length > 1 && (
              <p className="text-xs text-yellow-700 mt-0.5">
                Please review the following warnings
              </p>
            )}
          </div>
        </div>

        {/* Warnings List */}
        {hasMultipleTypes ? (
          // Grouped by type
          <div className="space-y-3">
            {Object.entries(groupedWarnings).map(([type, typeWarnings]) => (
              <div key={type} className="space-y-2">
                {type !== 'general' && (
                  <Badge variant="warning" size="sm" className="capitalize">
                    {type}
                  </Badge>
                )}
                <ul className="space-y-2" role="list">
                  {typeWarnings.map(warning => (
                    <WarningItem
                      key={warning.id}
                      warning={warning}
                      expanded={expandedWarnings.has(warning.id)}
                      acknowledged={acknowledgedWarnings.has(warning.id) || warning.acknowledged}
                      onToggleExpand={() => toggleExpand(warning.id)}
                      onDismiss={dismissible ? () => handleDismiss(warning.id) : undefined}
                      onAcknowledge={acknowledgeable ? () => handleAcknowledge(warning.id) : undefined}
                      compact={compact}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          // Simple list
          <ul className={cn('space-y-2', compact && 'space-y-1')} role="list">
            {activeWarnings.map(warning => (
              <WarningItem
                key={warning.id}
                warning={warning}
                expanded={expandedWarnings.has(warning.id)}
                acknowledged={acknowledgedWarnings.has(warning.id) || warning.acknowledged}
                onToggleExpand={() => toggleExpand(warning.id)}
                onDismiss={dismissible ? () => handleDismiss(warning.id) : undefined}
                onAcknowledge={acknowledgeable ? () => handleAcknowledge(warning.id) : undefined}
                compact={compact}
              />
            ))}
          </ul>
        )}
      </div>
    </Alert>
  );
};

/**
 * Individual warning item component
 */
interface WarningItemProps {
  warning: Warning;
  expanded: boolean;
  acknowledged: boolean;
  onToggleExpand: () => void;
  onDismiss?: () => void;
  onAcknowledge?: () => void;
  compact: boolean;
}

const WarningItem: React.FC<WarningItemProps> = ({
  warning,
  expanded,
  acknowledged,
  onToggleExpand,
  onDismiss,
  onAcknowledge,
  compact,
}) => {
  const hasDetails = !!warning.details;

  return (
    <li
      className={cn(
        'flex items-start gap-2 text-sm text-yellow-800',
        acknowledged && 'opacity-60'
      )}
    >
      <span className="text-yellow-600 font-bold flex-shrink-0" aria-hidden="true">•</span>

      <div className="flex-1 min-w-0">
        {/* Warning message */}
        <div className="flex items-start gap-2">
          <span className={cn('flex-1', acknowledged && 'line-through')}>
            {warning.message}
          </span>

          {acknowledged && (
            <Badge variant="success" size="sm" className="flex-shrink-0 gap-1">
              <Check className="w-3 h-3" />
              Acknowledged
            </Badge>
          )}
        </div>

        {/* Details toggle */}
        {hasDetails && (
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-xs text-yellow-700 hover:text-yellow-900 mt-1 font-medium"
            aria-expanded={expanded}
            aria-controls={`warning-details-${warning.id}`}
          >
            {expanded ? (
              <>
                <ChevronDown className="w-3 h-3" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronRight className="w-3 h-3" />
                Show Details
              </>
            )}
          </button>
        )}

        {/* Expanded details */}
        {hasDetails && expanded && (
          <div
            id={`warning-details-${warning.id}`}
            className="mt-2 p-2 bg-yellow-50 rounded-md border border-yellow-200"
          >
            <p className="text-xs text-yellow-800">{warning.details}</p>
          </div>
        )}

        {/* Actions */}
        {(onAcknowledge || onDismiss) && !acknowledged && (
          <div className="flex items-center gap-2 mt-2">
            {onAcknowledge && (
              <button
                onClick={onAcknowledge}
                className="text-xs px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded transition-colors"
              >
                Acknowledge
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-xs text-yellow-700 hover:text-yellow-900 transition-colors"
                aria-label={`Dismiss warning: ${warning.message}`}
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-yellow-600 hover:text-yellow-800 transition-colors p-0.5"
          aria-label={`Dismiss warning: ${warning.message}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </li>
  );
};

WarningsList.displayName = 'WarningsList';

export default React.memo(WarningsList);
