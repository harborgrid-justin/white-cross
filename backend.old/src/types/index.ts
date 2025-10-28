/**
 * LOC: B5C5B3D032
 * WC-IDX-TYP-067 | index.ts - Types Module Barrel Export
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - configuration.ts (routes/configuration.ts)
 */

/**
 * WC-IDX-TYP-067 | index.ts - Types Module Barrel Export
 * Purpose: Central export point for all TypeScript types, enums, and interfaces across the healthcare platform
 * Upstream: ../database/types/enums, ./appointment.ts, ./hapi.ts, ./phi.ts | Dependencies: type modules, database enums
 * Downstream: All ../routes/*.ts, ../services/*.ts, ../middleware/*.ts | Called by: application components
 * Related: ./express.d.ts, ../shared/types/*.ts, ../database/models/*.ts
 * Exports: User, AuthUser, ConfigCategory, UserRole re-exports | Key Services: Type aggregation and re-export
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Barrel Export
 * Critical Path: Type import → Interface validation → Application logic → Type safety
 * LLM Context: Healthcare platform types aggregation with user management, configuration enums, authentication interfaces, Express global extensions
 */

// Re-export UserRole from canonical source
export { UserRole } from '../database/types/enums';
import { UserRole } from '../database/types/enums';

/**
 * Configuration categories for system settings organization.
 * Groups related configuration settings for management and retrieval.
 *
 * @enum {string}
 */
export enum ConfigCategory {
  /** System-wide configuration settings */
  SYSTEM = 'SYSTEM',
  /** Security and authentication settings */
  SECURITY = 'SECURITY',
  /** Notification and communication preferences */
  NOTIFICATION = 'NOTIFICATION',
  /** Appointment scheduling configuration */
  APPOINTMENT = 'APPOINTMENT',
  /** Medication management settings */
  MEDICATION = 'MEDICATION',
  /** Reporting and analytics configuration */
  REPORTING = 'REPORTING',
  /** Third-party integration settings */
  INTEGRATION = 'INTEGRATION',
  /** User interface customization */
  UI = 'UI',
  /** HIPAA compliance and audit settings */
  COMPLIANCE = 'COMPLIANCE'
}

/**
 * Data types for configuration values.
 * Determines validation and storage format for configuration settings.
 *
 * @enum {string}
 */
export enum ConfigValueType {
  /** String value */
  STRING = 'STRING',
  /** Numeric value */
  NUMBER = 'NUMBER',
  /** Boolean true/false */
  BOOLEAN = 'BOOLEAN',
  /** JSON object or array */
  JSON = 'JSON',
  /** Enumerated value from predefined set */
  ENUM = 'ENUM',
  /** Date or datetime value */
  DATE = 'DATE'
}

/**
 * Scope levels for configuration settings.
 * Determines where configuration applies in the organizational hierarchy.
 *
 * @enum {string}
 */
export enum ConfigScope {
  /** System-wide default settings */
  SYSTEM = 'SYSTEM',
  /** District-level settings (override system defaults) */
  DISTRICT = 'DISTRICT',
  /** School-level settings (override district defaults) */
  SCHOOL = 'SCHOOL',
  /** User-specific settings (highest priority) */
  USER = 'USER'
}

/**
 * Complete user entity with all database fields.
 * Represents a user account in the healthcare platform.
 *
 * @interface User
 * @property {string} id - Unique user identifier (UUID)
 * @property {string} email - User's email address (unique, used for login)
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {UserRole} role - User's role (determines permissions)
 * @property {boolean} isActive - Whether user account is active
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Authenticated user data for session context.
 * Subset of User interface containing essential authentication data.
 *
 * @interface AuthUser
 * @property {string} id - Unique user identifier
 * @property {string} email - User's email address
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {UserRole} role - User's role
 * @property {boolean} isActive - Account active status
 *
 * @remarks
 * Used in JWT tokens and authentication context. Excludes timestamps
 * to minimize token size.
 */
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

/**
 * Global Express type extension for authenticated user.
 * Merges AuthUser interface with Express.User for request context.
 *
 * @remarks
 * This global declaration ensures Express Request objects have proper
 * TypeScript typing for the authenticated user after auth middleware.
 */
declare global {
  namespace Express {
    /**
     * User interface for Express request context.
     * Extends AuthUser with all authentication fields.
     */
    interface User extends AuthUser {}
  }
}

/**
 * Barrel exports for centralized type definitions.
 * Re-exports all type modules for convenient importing.
 *
 * @remarks
 * Import from this file to access all platform types:
 * ```typescript
 * import { VitalSigns, HealthRecordInfo, IntegrationSettings } from '@/types';
 * ```
 */
export * from './health';
export * from './database';
export * from './integration';
export * from './validation';
