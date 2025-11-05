/**
 * Accessible Emergency Alert Component
 *
 * CRITICAL PATIENT SAFETY: Emergency alerts MUST be announced to screen readers
 * immediately using aria-live="assertive" and role="alert".
 *
 * @module components/accessible/EmergencyAlert
 * @since 2025-11-05
 */

'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface EmergencyAlertProps {
  /**
   * Alert severity level
   */
  severity: 'critical' | 'high' | 'medium' | 'low';

  /**
   * Alert title (e.g., "Anaphylaxis Alert")
   */
  title: string;

  /**
   * Alert message
   */
  message: string;

  /**
   * Student information
   */
  student: {
    name: string;
    id: string;
  };

  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;

  /**
   * Auto-dismiss after milliseconds (optional)
   */
  autoDismiss?: number;
}

const SEVERITY_STYLES = {
  critical: {
    bg: 'bg-red-50 border-red-600',
    text: 'text-red-900',
    icon: 'text-red-600',
  },
  high: {
    bg: 'bg-orange-50 border-orange-500',
    text: 'text-orange-900',
    icon: 'text-orange-500',
  },
  medium: {
    bg: 'bg-yellow-50 border-yellow-400',
    text: 'text-yellow-900',
    icon: 'text-yellow-600',
  },
  low: {
    bg: 'bg-blue-50 border-blue-400',
    text: 'text-blue-900',
    icon: 'text-blue-500',
  },
};

/**
 * Emergency Alert Component with ARIA Live Region
 *
 * WCAG 4.1.3: This component uses aria-live="assertive" to ensure
 * critical health alerts are announced immediately to screen readers.
 */
export function EmergencyAlert({
  severity,
  title,
  message,
  student,
  onDismiss,
  autoDismiss,
}: EmergencyAlertProps) {
  const alertRef = useRef<HTMLDivElement>(null);
  const styles = SEVERITY_STYLES[severity];

  // Auto-dismiss timer
  useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(onDismiss, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss]);

  // Focus alert for keyboard users
  useEffect(() => {
    if (severity === 'critical' && alertRef.current) {
      alertRef.current.focus();
    }
  }, [severity]);

  return (
    <div
      ref={alertRef}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={severity === 'critical' ? 0 : -1}
      className={`${styles.bg} ${styles.text} border-l-4 p-4 rounded-r-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className="flex-shrink-0">
          <AlertTriangle
            className={`${styles.icon} h-6 w-6`}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium">
            {title}
            {severity === 'critical' && (
              <span className="ml-2 text-sm font-normal">(Critical)</span>
            )}
          </h3>

          <div className="mt-2 text-sm">
            <p className="font-semibold">Student: {student.name}</p>
            <p className="mt-1">{message}</p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => {
                // Navigate to student health record
                window.location.href = `/students/${student.id}/health-records`;
              }}
            >
              View Health Record
            </button>
            <button
              type="button"
              className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={() => {
                // Navigate to emergency contacts
                window.location.href = `/students/${student.id}/emergency-contacts`;
              }}
            >
              Emergency Contacts
            </button>
          </div>
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onDismiss}
              aria-label={`Dismiss ${title} alert for ${student.name}`}
              className={`${styles.text} inline-flex rounded-md hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 p-1.5`}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Emergency Alert Container - For multiple alerts
 */
export function EmergencyAlertContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-label="Emergency alerts"
      className="fixed top-4 right-4 z-50 max-w-md space-y-4"
    >
      {children}
    </div>
  );
}

/**
 * ACCESSIBILITY FEATURES:
 *
 * ✅ role="alert" - Immediately announced to screen readers
 * ✅ aria-live="assertive" - Interrupts current reading
 * ✅ aria-atomic="true" - Reads entire alert, not just changes
 * ✅ tabIndex for keyboard focus on critical alerts
 * ✅ aria-label on dismiss button
 * ✅ aria-hidden on decorative icons
 * ✅ Visible focus indicators
 * ✅ Keyboard accessible buttons
 *
 * PATIENT SAFETY:
 * - Critical alerts automatically receive focus
 * - Emergency contacts immediately accessible
 * - Health records one click away
 * - Clear visual hierarchy by severity
 */
