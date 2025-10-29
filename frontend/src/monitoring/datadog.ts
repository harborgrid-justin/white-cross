/**
 * DataDog RUM (Real User Monitoring) Integration
 *
 * Client-side performance and error tracking with DataDog
 */

import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import { sanitizeObject, sanitizeUserContext } from './utils/phi-sanitizer';
import type { UserContext } from './types';

let isInitialized = false;

export interface DataDogConfig {
  applicationId: string;
  clientToken: string;
  site?: string;
  service: string;
  env: string;
  version?: string;
  sessionSampleRate?: number;
  sessionReplaySampleRate?: number;
  trackInteractions?: boolean;
  trackResources?: boolean;
  trackLongTasks?: boolean;
  enableLogs?: boolean;
}

/**
 * Initialize DataDog RUM
 */
export function initDataDog(config: DataDogConfig): void {
  if (isInitialized) {
    console.warn('DataDog already initialized');
    return;
  }

  if (!config.applicationId || !config.clientToken) {
    console.warn('DataDog credentials not provided, skipping initialization');
    return;
  }

  // Initialize RUM
  datadogRum.init({
    applicationId: config.applicationId,
    clientToken: config.clientToken,
    site: config.site || 'datadoghq.com',
    service: config.service,
    env: config.env,
    version: config.version,
    sessionSampleRate: config.sessionSampleRate || 100,
    sessionReplaySampleRate: config.sessionReplaySampleRate || 20,
    trackInteractions: config.trackInteractions !== false,
    trackResources: config.trackResources !== false,
    trackLongTasks: config.trackLongTasks !== false,
    defaultPrivacyLevel: 'mask', // Mask all user inputs by default

    // PHI Sanitization - beforeSend hook
    beforeSend: (event, context) => {
      // Sanitize all event data
      if (event.error) {
        event.error.message = sanitizeObject(event.error.message, { strictMode: true });
        if (event.error.stack) {
          event.error.stack = sanitizeObject(event.error.stack, { strictMode: true });
        }
      }

      if (event.resource) {
        event.resource.url = sanitizeObject(event.resource.url, { strictMode: true });
      }

      if (event.action) {
        event.action.target = sanitizeObject(event.action.target || {}, { strictMode: true });
      }

      if (event.context) {
        event.context = sanitizeObject(event.context, { strictMode: true });
      }

      return true; // Continue sending event
    },
  });

  // Initialize Logs if enabled
  if (config.enableLogs) {
    datadogLogs.init({
      clientToken: config.clientToken,
      site: config.site || 'datadoghq.com',
      service: config.service,
      env: config.env,
      version: config.version,
      forwardErrorsToLogs: true,
      sessionSampleRate: 100,

      // Sanitize log data
      beforeSend: (log) => {
        if (log.message) {
          log.message = sanitizeObject(log.message, { strictMode: true });
        }
        if (log.error) {
          log.error = sanitizeObject(log.error, { strictMode: true });
        }
        return true;
      },
    });
  }

  // Start session
  datadogRum.startSessionReplayRecording();

  isInitialized = true;
}

/**
 * Set user context
 */
export function setUser(user: UserContext | null): void {
  if (!isInitialized) return;

  if (user) {
    const sanitizedUser = sanitizeUserContext(user);
    datadogRum.setUser({
      id: sanitizedUser.id,
      role: sanitizedUser.role,
      district_id: sanitizedUser.districtId,
      school_id: sanitizedUser.schoolId,
    });
  } else {
    datadogRum.clearUser();
  }
}

/**
 * Add custom action
 */
export function addAction(
  name: string,
  context?: Record<string, any>
): void {
  if (!isInitialized) return;

  datadogRum.addAction(name, sanitizeObject(context || {}, { strictMode: true }));
}

/**
 * Add custom error
 */
export function addError(
  error: Error,
  context?: Record<string, any>
): void {
  if (!isInitialized) return;

  datadogRum.addError(error, sanitizeObject(context || {}, { strictMode: true }));
}

/**
 * Add custom timing
 */
export function addTiming(name: string): void {
  if (!isInitialized) return;
  datadogRum.addTiming(name);
}

/**
 * Set global context
 */
export function setGlobalContext(context: Record<string, any>): void {
  if (!isInitialized) return;
  datadogRum.setGlobalContext(sanitizeObject(context, { strictMode: true }));
}

/**
 * Remove global context property
 */
export function removeGlobalContextProperty(key: string): void {
  if (!isInitialized) return;
  datadogRum.removeGlobalContextProperty(key);
}

/**
 * Clear global context
 */
export function clearGlobalContext(): void {
  if (!isInitialized) return;
  datadogRum.clearGlobalContext();
}

/**
 * Start view (page navigation)
 */
export function startView(name: string): void {
  if (!isInitialized) return;
  datadogRum.startView({ name });
}

/**
 * Log to DataDog Logs
 */
export function log(
  message: string,
  context?: Record<string, any>,
  level: 'debug' | 'info' | 'warn' | 'error' = 'info'
): void {
  if (!isInitialized) return;

  const sanitizedContext = context
    ? sanitizeObject(context, { strictMode: true })
    : undefined;

  datadogLogs.logger[level](message, sanitizedContext);
}

/**
 * Healthcare-specific tracking
 */
export const healthcare = {
  /**
   * Track medication administration
   */
  medicationAdministered: (medicationId: string, success: boolean) => {
    addAction('medication_administered', {
      medication_id: medicationId,
      success,
    });
  },

  /**
   * Track medication error
   */
  medicationError: (medicationId: string, error: Error) => {
    addError(error, {
      type: 'medication_error',
      medication_id: medicationId,
    });
  },

  /**
   * Track PHI access
   */
  phiAccessed: (resourceType: string, action: string) => {
    addAction('phi_accessed', {
      resource_type: resourceType,
      action,
    });
  },

  /**
   * Track health record access
   */
  healthRecordAccessed: (recordId: string, recordType: string) => {
    addAction('health_record_accessed', {
      record_id: recordId,
      record_type: recordType,
    });
  },

  /**
   * Track emergency alert
   */
  emergencyAlert: (alertType: string, severity: string) => {
    addAction('emergency_alert', {
      alert_type: alertType,
      severity,
    });
  },

  /**
   * Track compliance violation
   */
  complianceViolation: (violationType: string, severity: string) => {
    addError(new Error(`Compliance violation: ${violationType}`), {
      type: 'compliance_violation',
      severity,
    });
  },
};

export default {
  initDataDog,
  setUser,
  addAction,
  addError,
  addTiming,
  setGlobalContext,
  removeGlobalContextProperty,
  clearGlobalContext,
  startView,
  log,
  healthcare,
};
