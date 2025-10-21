/**
 * Domain-Based Store Organization
 * 
 * Enterprise-grade store organization following Domain-Driven Design (DDD) principles.
 * Organizes state management by business domain for better maintainability and scalability.
 * 
 * @module stores/domains
 */

// ==========================================
// CORE DOMAIN
// ==========================================
// Authentication, user management, and system settings
export * from './core';

// ==========================================
// HEALTHCARE DOMAIN
// ==========================================
// Medical records, medications, appointments, incidents
export * from './healthcare';

// ==========================================
// ADMINISTRATION DOMAIN
// ==========================================
// District/school management, reporting, inventory
export * from './administration';

// ==========================================
// COMMUNICATION DOMAIN
// ==========================================
// Messaging, notifications, document sharing
export * from './communication';

// ==========================================
// DOMAIN UTILITIES
// ==========================================

/**
 * Domain registry for dynamic imports and organization
 */
export const domainRegistry = {
  core: () => import('./core'),
  healthcare: () => import('./healthcare'),
  administration: () => import('./administration'),
  communication: () => import('./communication'),
} as const;

/**
 * Available domain names
 */
export type DomainName = keyof typeof domainRegistry;

/**
 * Domain metadata
 */
export const domainMetadata = {
  core: {
    name: 'Core',
    description: 'Authentication, user management, and system settings',
    slices: ['auth', 'users', 'settings'],
  },
  healthcare: {
    name: 'Healthcare',
    description: 'Medical records, medications, appointments, incidents',
    slices: ['healthRecords', 'medications', 'appointments', 'incidentReports', 'emergencyContacts', 'students'],
  },
  administration: {
    name: 'Administration',
    description: 'District/school management, reporting, inventory',
    slices: ['districts', 'schools', 'reports', 'inventory', 'settings'],
  },
  communication: {
    name: 'Communication',
    description: 'Messaging, notifications, document sharing',
    slices: ['communication', 'documents'],
  },
} as const;

/**
 * Get domain information by name
 */
export const getDomainInfo = (domainName: DomainName) => {
  return domainMetadata[domainName];
};

/**
 * Get all domain names
 */
export const getAllDomainNames = (): DomainName[] => {
  return Object.keys(domainRegistry) as DomainName[];
};

/**
 * Domain-based selector factory
 */
export const createDomainSelector = <T>(
  domainName: DomainName,
  selectorFunction: (domainState: any) => T
) => {
  return (state: any): T => {
    // This would need proper implementation based on actual state structure
    const domainSlices = domainMetadata[domainName].slices;
    const domainState = domainSlices.reduce((acc, slice) => {
      if (state[slice]) {
        acc[slice] = state[slice];
      }
      return acc;
    }, {} as any);
    
    return selectorFunction(domainState);
  };
};

/**
 * Domain health checker
 */
export const createDomainHealthSelector = (domainName: DomainName) => {
  return createDomainSelector(domainName, (domainState) => {
    const slices = Object.keys(domainState);
    const healthStatus = slices.map(slice => {
      const sliceState = domainState[slice];
      return {
        slice,
        isLoading: sliceState?.isLoading || false,
        hasError: !!(sliceState?.error),
        error: sliceState?.error || null,
      };
    });

    return {
      domain: domainName,
      slices: healthStatus,
      overallHealth: healthStatus.every(s => !s.isLoading && !s.hasError) ? 'healthy' : 'issues',
      loadingSlices: healthStatus.filter(s => s.isLoading).map(s => s.slice),
      errorSlices: healthStatus.filter(s => s.hasError).map(s => s.slice),
    };
  });
};