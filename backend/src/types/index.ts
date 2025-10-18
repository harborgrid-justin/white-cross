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

// Configuration Enums
export enum ConfigCategory {
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  NOTIFICATION = 'NOTIFICATION',
  APPOINTMENT = 'APPOINTMENT',
  MEDICATION = 'MEDICATION',
  REPORTING = 'REPORTING',
  INTEGRATION = 'INTEGRATION',
  UI = 'UI',
  COMPLIANCE = 'COMPLIANCE'
}

export enum ConfigValueType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  ENUM = 'ENUM',
  DATE = 'DATE'
}

export enum ConfigScope {
  SYSTEM = 'SYSTEM',
  DISTRICT = 'DISTRICT',
  SCHOOL = 'SCHOOL',
  USER = 'USER'
}

// User Interface
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

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

// Extend Express Request type for authenticated user
declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
