/**
 * Custom Analytics Service
 *
 * Healthcare-specific event tracking with PHI sanitization
 */

import { sanitizeObject } from './utils/phi-sanitizer';
import type {
  AnalyticsEvent,
  EventCategory,
  HealthcareEventType,
  HealthcareMetrics,
} from './types';

// Event storage
const eventQueue: AnalyticsEvent[] = [];
const healthcareMetrics: HealthcareMetrics = {
  medicationAdministrations: 0,
  healthRecordAccesses: 0,
  phiAccesses: 0,
  emergencyAlerts: 0,
  complianceViolations: 0,
  timestamp: new Date(),
};

// Session tracking
let sessionId: string | null = null;
let userId: string | null = null;
let sessionStartTime: Date | null = null;

/**
 * Initialize analytics
 */
export function initAnalytics(config: {
  userId?: string;
  autoTrack?: boolean;
}): void {
  userId = config.userId || null;
  sessionId = generateSessionId();
  sessionStartTime = new Date();

  if (config.autoTrack !== false) {
    // Auto-track page views
    trackPageView();

    // Track page visibility changes
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
  }
}

/**
 * Set user ID
 */
export function setUserId(id: string | null): void {
  userId = id;
}

/**
 * Track generic event
 */
export function trackEvent(
  name: string,
  category: EventCategory,
  action: string,
  properties?: Record<string, any>
): void {
  const event: AnalyticsEvent = {
    name,
    category,
    action,
    properties: properties ? sanitizeObject(properties, { strictMode: true }) : undefined,
    userId: userId || undefined,
    sessionId: sessionId || undefined,
    timestamp: new Date(),
  };

  eventQueue.push(event);
  flushIfNeeded();
}

/**
 * Track page view
 */
export function trackPageView(path?: string): void {
  if (typeof window === 'undefined') return;

  const pagePath = path || window.location.pathname;

  trackEvent('page_view', 'navigation', 'view', {
    path: pagePath,
    referrer: document.referrer,
    title: document.title,
  });
}

/**
 * Track user action
 */
export function trackAction(
  action: string,
  target: string,
  properties?: Record<string, any>
): void {
  trackEvent(`user_action:${action}`, 'user_action', action, {
    target,
    ...properties,
  });
}

/**
 * Track button click
 */
export function trackClick(
  buttonName: string,
  context?: Record<string, any>
): void {
  trackAction('click', buttonName, context);
}

/**
 * Track form submission
 */
export function trackFormSubmit(
  formName: string,
  context?: Record<string, any>
): void {
  trackAction('form_submit', formName, context);
}

/**
 * Track search
 */
export function trackSearch(
  query: string,
  results: number,
  context?: Record<string, any>
): void {
  trackEvent('search', 'user_action', 'search', {
    query: sanitizeObject(query, { strictMode: true }),
    results_count: results,
    ...context,
  });
}

/**
 * Track healthcare-specific events
 */
export const healthcare = {
  /**
   * Track medication administration
   */
  medicationAdministered: (medicationId: string, success: boolean) => {
    healthcareMetrics.medicationAdministrations++;

    trackEvent('medication_administered', 'healthcare', 'medication', {
      medication_id: medicationId,
      success,
    });
  },

  /**
   * Track medication error
   */
  medicationError: (medicationId: string, errorType: string) => {
    trackEvent('medication_error', 'healthcare', 'medication_error', {
      medication_id: medicationId,
      error_type: errorType,
    });
  },

  /**
   * Track health record access
   */
  healthRecordAccessed: (recordId: string, recordType: string) => {
    healthcareMetrics.healthRecordAccesses++;

    trackEvent('health_record_accessed', 'healthcare', 'access', {
      record_id: recordId,
      record_type: recordType,
    });
  },

  /**
   * Track health record update
   */
  healthRecordUpdated: (recordId: string, recordType: string, fields: string[]) => {
    trackEvent('health_record_updated', 'healthcare', 'update', {
      record_id: recordId,
      record_type: recordType,
      fields_updated: fields,
    });
  },

  /**
   * Track PHI access (for audit purposes)
   */
  phiAccessed: (resourceType: string, action: string) => {
    healthcareMetrics.phiAccesses++;

    trackEvent('phi_accessed', 'security', 'access', {
      resource_type: resourceType,
      action,
    });
  },

  /**
   * Track appointment scheduled
   */
  appointmentScheduled: (appointmentType: string, studentId: string) => {
    trackEvent('appointment_scheduled', 'healthcare', 'schedule', {
      appointment_type: appointmentType,
      student_id: studentId,
    });
  },

  /**
   * Track appointment cancelled
   */
  appointmentCancelled: (appointmentId: string, reason: string) => {
    trackEvent('appointment_cancelled', 'healthcare', 'cancel', {
      appointment_id: appointmentId,
      reason,
    });
  },

  /**
   * Track emergency alert
   */
  emergencyAlert: (alertType: string, severity: string) => {
    healthcareMetrics.emergencyAlerts++;

    trackEvent('emergency_alert', 'healthcare', 'alert', {
      alert_type: alertType,
      severity,
    });
  },

  /**
   * Track compliance violation
   */
  complianceViolation: (violationType: string, severity: string) => {
    healthcareMetrics.complianceViolations++;

    trackEvent('compliance_violation', 'security', 'violation', {
      violation_type: violationType,
      severity,
    });
  },

  /**
   * Track document upload
   */
  documentUploaded: (documentType: string, fileSize: number) => {
    trackEvent('document_uploaded', 'healthcare', 'upload', {
      document_type: documentType,
      file_size: fileSize,
    });
  },

  /**
   * Track document download
   */
  documentDownloaded: (documentId: string, documentType: string) => {
    trackEvent('document_downloaded', 'healthcare', 'download', {
      document_id: documentId,
      document_type: documentType,
    });
  },

  /**
   * Track consent action
   */
  consentAction: (consentType: string, action: 'given' | 'revoked') => {
    trackEvent('consent_action', 'healthcare', action, {
      consent_type: consentType,
    });
  },
};

/**
 * Track API call
 */
export function trackAPICall(
  endpoint: string,
  method: string,
  status: number,
  duration: number
): void {
  trackEvent('api_call', 'api_call', method, {
    endpoint: sanitizeObject(endpoint, { strictMode: true }),
    status,
    duration,
    success: status >= 200 && status < 300,
  });
}

/**
 * Track error
 */
export function trackError(
  error: Error,
  context?: Record<string, any>
): void {
  trackEvent('error', 'error', 'error_occurred', {
    error_name: error.name,
    error_message: sanitizeObject(error.message, { strictMode: true }),
    ...context,
  });
}

/**
 * Get healthcare metrics
 */
export function getHealthcareMetrics(): HealthcareMetrics {
  return { ...healthcareMetrics };
}

/**
 * Get session info
 */
export function getSessionInfo(): {
  sessionId: string | null;
  userId: string | null;
  duration: number | null;
  eventCount: number;
} {
  return {
    sessionId,
    userId,
    duration: sessionStartTime
      ? Date.now() - sessionStartTime.getTime()
      : null,
    eventCount: eventQueue.length,
  };
}

/**
 * Get all events
 */
export function getEvents(): AnalyticsEvent[] {
  return [...eventQueue];
}

/**
 * Clear event queue
 */
export function clearEvents(): void {
  eventQueue.length = 0;
}

/**
 * Flush events to backend
 */
export async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0;

  try {
    // Send events to backend
    const response = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events,
        session: getSessionInfo(),
      }),
    });

    if (!response.ok) {
      console.error('Failed to send analytics events:', response.statusText);
      // Re-add events to queue
      eventQueue.push(...events);
    }
  } catch (error) {
    console.error('Error sending analytics events:', error);
    // Re-add events to queue
    eventQueue.push(...events);
  }
}

/**
 * Flush if queue is getting large
 */
function flushIfNeeded(): void {
  if (eventQueue.length >= 50) {
    flushEvents();
  }
}

/**
 * Handle visibility change
 */
function handleVisibilityChange(): void {
  if (document.visibilityState === 'hidden') {
    flushEvents();
  }
}

/**
 * Handle before unload
 */
function handleBeforeUnload(): void {
  // Use sendBeacon for reliable delivery
  if (eventQueue.length > 0 && navigator.sendBeacon) {
    const data = JSON.stringify({
      events: eventQueue,
      session: getSessionInfo(),
    });

    navigator.sendBeacon('/api/analytics/events', data);
    eventQueue.length = 0;
  }
}

/**
 * Generate session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Export analytics data
 */
export function exportAnalytics(): {
  events: AnalyticsEvent[];
  metrics: HealthcareMetrics;
  session: ReturnType<typeof getSessionInfo>;
} {
  return {
    events: getEvents(),
    metrics: getHealthcareMetrics(),
    session: getSessionInfo(),
  };
}

export default {
  initAnalytics,
  setUserId,
  trackEvent,
  trackPageView,
  trackAction,
  trackClick,
  trackFormSubmit,
  trackSearch,
  healthcare,
  trackAPICall,
  trackError,
  getHealthcareMetrics,
  getSessionInfo,
  getEvents,
  clearEvents,
  flushEvents,
  exportAnalytics,
};
