/**
 * Security Middleware
 * 
 * Enterprise security middleware for authentication, authorization, session management,
 * and security policy enforcement.
 * 
 * @module security.middleware
 */

import { Middleware } from '@reduxjs/toolkit';

/**
 * Authentication state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  permissions: string[];
  roles: string[];
  sessionExpiry: number | null;
}

/**
 * Security policy configuration
 */
export interface SecurityPolicy {
  sessionTimeoutMs: number;
  maxLoginAttempts: number;
  lockoutDurationMs: number;
  requireMFA: boolean;
  allowedOrigins: string[];
  csrfProtection: boolean;
  secureHeaders: boolean;
}

/**
 * Session management utilities
 */
export class SessionManager {
  private static instance: SessionManager;
  private sessionCheckInterval: number | null = null;
  private listeners: Array<(isValid: boolean) => void> = [];

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Start session monitoring
   */
  startSessionMonitoring(_sessionTimeoutMs: number = 30 * 60 * 1000) {
    this.stopSessionMonitoring();

    this.sessionCheckInterval = window.setInterval(() => {
      const isValid = this.isSessionValid();
      if (!isValid) {
        this.notifyListeners(false);
        this.stopSessionMonitoring();
      }
    }, 60 * 1000); // Check every minute
  }

  /**
   * Stop session monitoring
   */
  stopSessionMonitoring() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  /**
   * Check if current session is valid
   */
  isSessionValid(): boolean {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return false;

    try {
      const parsed = JSON.parse(authStorage);
      const token = parsed.state?.token;
      const expiry = parsed.state?.sessionExpiry;

      if (!token) return false;
      if (expiry && Date.now() > expiry) return false;

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Refresh session expiry
   */
  refreshSession(extendByMs: number = 30 * 60 * 1000) {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return;

    try {
      const parsed = JSON.parse(authStorage);
      if (parsed.state) {
        parsed.state.sessionExpiry = Date.now() + extendByMs;
        localStorage.setItem('auth-storage', JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  }

  /**
   * Clear session data
   */
  clearSession() {
    localStorage.removeItem('auth-storage');
    localStorage.removeItem('auth_token');
    this.stopSessionMonitoring();
    this.notifyListeners(false);
  }

  /**
   * Add session state listener
   */
  addListener(listener: (isValid: boolean) => void) {
    this.listeners.push(listener);
  }

  /**
   * Remove session state listener
   */
  removeListener(listener: (isValid: boolean) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(isValid: boolean) {
    this.listeners.forEach(listener => {
      try {
        listener(isValid);
      } catch (error) {
        console.error('Session listener error:', error);
      }
    });
  }
}

/**
 * Permission checker utility
 */
export class PermissionChecker {
  private static permissions: string[] = [];
  private static roles: string[] = [];

  static updatePermissions(permissions: string[], roles: string[]) {
    PermissionChecker.permissions = permissions;
    PermissionChecker.roles = roles;
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission: string): boolean {
    return PermissionChecker.permissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  static hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => PermissionChecker.hasPermission(permission));
  }

  /**
   * Check if user has all specified permissions
   */
  static hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => PermissionChecker.hasPermission(permission));
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string): boolean {
    return PermissionChecker.roles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(roles: string[]): boolean {
    return roles.some(role => PermissionChecker.hasRole(role));
  }

  /**
   * Check if user can access a specific resource
   */
  static canAccess(resource: string, action: string): boolean {
    const permission = `${resource}:${action}`;
    return PermissionChecker.hasPermission(permission);
  }
}

/**
 * HIPAA compliance utilities for healthcare data protection
 */
export class HIPAACompliance {
  private static sensitiveFields = [
    'ssn', 'socialSecurityNumber', 'dateOfBirth', 'dob',
    'medicalRecordNumber', 'mrn', 'diagnosis', 'medication',
    'allergies', 'healthCondition', 'treatmentPlan'
  ];

  /**
   * Check if data contains sensitive healthcare information
   */
  static containsSensitiveData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;

    const checkObject = (obj: any): boolean => {
      for (const key in obj) {
        if (HIPAACompliance.sensitiveFields.includes(key.toLowerCase())) {
          return true;
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (checkObject(obj[key])) return true;
        }
      }
      return false;
    };

    return checkObject(data);
  }

  /**
   * Mask sensitive data for logging or display
   */
  static maskSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const maskObject = (obj: any): any => {
      const masked = { ...obj };
      for (const key in masked) {
        if (HIPAACompliance.sensitiveFields.includes(key.toLowerCase())) {
          masked[key] = '***MASKED***';
        } else if (typeof masked[key] === 'object' && masked[key] !== null) {
          masked[key] = maskObject(masked[key]);
        }
      }
      return masked;
    };

    return maskObject(data);
  }

  /**
   * Log access to protected health information (PHI)
   */
  static logPHIAccess(userId: string, resource: string, action: string, context?: any) {
    console.log('[HIPAA Audit]', {
      timestamp: new Date().toISOString(),
      userId,
      resource,
      action,
      context: context ? HIPAACompliance.maskSensitiveData(context) : undefined,
    });
  }
}

/**
 * Authentication middleware for Redux
 */
export const createAuthMiddleware = (policy: Partial<SecurityPolicy> = {}): Middleware => {
  const sessionManager = SessionManager.getInstance();
  
  // Start session monitoring if policy is defined
  if (policy.sessionTimeoutMs) {
    sessionManager.startSessionMonitoring(policy.sessionTimeoutMs);
  }

  return (store) => (next) => (action: any) => {
    const state = store.getState();
    const authState = state.auth as AuthState;

    // Check session validity on auth-related actions
    if (action.type && typeof action.type === 'string' && action.type.includes('auth/')) {
      if (!sessionManager.isSessionValid() && action.type !== 'auth/logout') {
        // Auto-logout if session is invalid
        store.dispatch({ type: 'auth/logout' });
        return;
      }
    }

    // Update permissions when auth state changes
    if (action.type === 'auth/loginSuccess' && action.payload) {
      PermissionChecker.updatePermissions(
        action.payload.permissions || [],
        action.payload.roles || []
      );
      
      // Start session monitoring
      if (policy.sessionTimeoutMs) {
        sessionManager.startSessionMonitoring(policy.sessionTimeoutMs);
      }
    }

    // Clear permissions on logout
    if (action.type === 'auth/logout') {
      PermissionChecker.updatePermissions([], []);
      sessionManager.clearSession();
    }

    // Audit HIPAA-related actions
    if (authState?.isAuthenticated && HIPAACompliance.containsSensitiveData(action.payload)) {
      HIPAACompliance.logPHIAccess(
        authState.user?.id || 'unknown',
        action.type,
        'access',
        action.payload
      );
    }

    return next(action);
  };
};

/**
 * Authorization middleware for Redux
 */
export const createAuthorizationMiddleware = (): Middleware => {
  return (store) => (next) => (action: any) => {
    const state = store.getState();
    const authState = state.auth as AuthState;

    // Check authorization for protected actions
    if (action.type && typeof action.type === 'string') {
      const [domain, operation] = action.type.split('/');
      
      // Define protected operations that require authorization
      const protectedOperations = ['create', 'update', 'delete'];
      
      if (protectedOperations.includes(operation)) {
        if (!authState?.isAuthenticated) {
          console.warn(`Unauthorized action attempted: ${action.type}`);
          return; // Block the action
        }

        // Check specific permissions
        const requiredPermission = `${domain}:${operation}`;
        if (!PermissionChecker.hasPermission(requiredPermission)) {
          console.warn(`Insufficient permissions for action: ${action.type}`);
          store.dispatch({
            type: 'auth/accessDenied',
            payload: { action: action.type, permission: requiredPermission }
          });
          return; // Block the action
        }
      }
    }

    return next(action);
  };
};

/**
 * Security monitoring middleware
 */
export const createSecurityMonitoringMiddleware = (): Middleware => {
  const suspiciousActivityThreshold = 10; // Actions per minute
  let actionCount = 0;
  let lastReset = Date.now();

  return (store) => (next) => (action: any) => {
    const now = Date.now();
    
    // Reset counter every minute
    if (now - lastReset > 60000) {
      actionCount = 0;
      lastReset = now;
    }

    actionCount++;

    // Check for suspicious activity
    if (actionCount > suspiciousActivityThreshold) {
      console.warn('[Security] Suspicious activity detected - high action frequency', {
        actionCount,
        timeWindow: now - lastReset,
        lastAction: action.type,
      });
    }

    // Monitor for potential security issues
    if (action.type && typeof action.type === 'string') {
      // Failed login attempts
      if (action.type === 'auth/loginFailed') {
        console.warn('[Security] Failed login attempt', {
          timestamp: new Date().toISOString(),
          action: action.type,
        });
      }

      // Privilege escalation attempts
      if (action.type.includes('admin') || action.type.includes('superuser')) {
        const state = store.getState();
        const authState = state.auth as AuthState;
        
        if (!PermissionChecker.hasRole('admin')) {
          console.warn('[Security] Potential privilege escalation attempt', {
            userId: authState?.user?.id,
            action: action.type,
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    return next(action);
  };
};

/**
 * Content Security Policy utilities
 */
export const cspUtils = {
  /**
   * Set Content Security Policy headers (for use with server-side rendering)
   */
  getCSPHeader: (allowInlineStyles: boolean = false): string => {
    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval'", // unsafe-eval needed for some build tools
      allowInlineStyles ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ];
    
    return directives.join('; ');
  },

  /**
   * Validate external resource URLs
   */
  isAllowedOrigin: (url: string, allowedOrigins: string[]): boolean => {
    try {
      const urlObj = new URL(url);
      return allowedOrigins.some(origin => urlObj.origin === origin);
    } catch {
      return false;
    }
  },
};