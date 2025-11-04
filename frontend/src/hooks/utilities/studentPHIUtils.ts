/**
 * Student PHI (Protected Health Information) Handling Utilities
 *
 * Utilities for sanitizing, logging, and managing access to Protected Health Information
 * in compliance with healthcare data privacy regulations.
 *
 * @module hooks/utilities/studentPHIUtils
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useCallback } from 'react';
import type { PHIHandlingOptions } from './studentUtilityTypes';

/**
 * Hook for PHI (Protected Health Information) handling
 *
 * @param options - PHI handling configuration
 * @returns PHI utilities and sanitization functions
 *
 * @example
 * ```tsx
 * const { sanitizeData, logDataAccess } = usePHIHandler({
 *   sanitize: true,
 *   excludeFields: ['ssn', 'medicalRecordNum'],
 *   logAccess: true
 * });
 *
 * const safeData = sanitizeData(studentData);
 * logDataAccess('student-view', studentId);
 * ```
 */
export const usePHIHandler = (options: PHIHandlingOptions = {}) => {
  const {
    sanitize = false,
    excludeFields = [],
    sanitizer,
    logAccess = false,
  } = options;

  /**
   * Default PHI sanitization function
   */
  const defaultSanitizer = useCallback(
    (data: any): any => {
      if (!data || typeof data !== 'object') return data;

      const sanitized = { ...data };

      // Remove or mask sensitive fields
      const sensitiveFields = [
        'ssn',
        'socialSecurityNumber',
        'medicalRecordNum',
        'insuranceId',
        ...excludeFields,
      ];

      sensitiveFields.forEach((field) => {
        if (sanitized[field]) {
          if (typeof sanitized[field] === 'string') {
            // Mask all but last 4 characters
            const value = sanitized[field];
            sanitized[field] =
              '*'.repeat(Math.max(0, value.length - 4)) + value.slice(-4);
          } else {
            delete sanitized[field];
          }
        }
      });

      // Recursively sanitize nested objects
      Object.keys(sanitized).forEach((key) => {
        if (sanitized[key] && typeof sanitized[key] === 'object') {
          if (Array.isArray(sanitized[key])) {
            sanitized[key] = sanitized[key].map((item: any) =>
              defaultSanitizer(item)
            );
          } else {
            sanitized[key] = defaultSanitizer(sanitized[key]);
          }
        }
      });

      return sanitized;
    },
    [excludeFields]
  );

  /**
   * Sanitize data according to PHI requirements
   */
  const sanitizeData = useCallback(
    (data: any) => {
      if (!sanitize) return data;
      return sanitizer ? sanitizer(data) : defaultSanitizer(data);
    },
    [sanitize, sanitizer, defaultSanitizer]
  );

  /**
   * Log data access for audit trails
   */
  const logDataAccess = useCallback(
    (action: string, resourceId?: string, metadata?: any) => {
      if (!logAccess) return;

      const auditEntry = {
        timestamp: new Date().toISOString(),
        action,
        resourceType: 'student',
        resourceId,
        userId: 'current-user', // Would get from auth context
        metadata: {
          userAgent: navigator.userAgent,
          ip: 'client-ip', // Would get from request context
          ...metadata,
        },
      };

      // In a real application, this would send to an audit logging service
      console.log('[PHI ACCESS LOG]', auditEntry);

      // Store in local storage for development (remove in production)
      try {
        const logs = JSON.parse(localStorage.getItem('phi-access-logs') || '[]');
        logs.push(auditEntry);
        // Keep only last 100 logs
        localStorage.setItem('phi-access-logs', JSON.stringify(logs.slice(-100)));
      } catch (error) {
        console.error('Failed to store PHI access log:', error);
      }
    },
    [logAccess]
  );

  /**
   * Check if user has permission to access PHI data
   */
  const checkPHIPermission = useCallback(
    (action: string, resourceId?: string): boolean => {
      // In a real application, this would check user permissions
      // For now, return true for all actions
      logDataAccess(`permission-check-${action}`, resourceId, { granted: true });
      return true;
    },
    [logDataAccess]
  );

  return {
    sanitizeData,
    logDataAccess,
    checkPHIPermission,
  };
};
