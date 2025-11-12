/**
 * WF-COMP-315 | administration-users.ts - User Management Type Definitions
 * Purpose: Type definitions for user management and authentication
 * Upstream: administration-enums.ts | Dependencies: None
 * Downstream: User management components | Called by: Admin user management UI
 * Related: administration-districts.ts (users belong to districts/schools), administration-audit.ts (user actions are logged)
 * Exports: User entity types, CRUD interfaces
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: User management and access control
 * LLM Context: Type definitions for user entities and role-based access
 */

import type { UserRole } from './administration-enums';

/**
 * User Management Types
 *
 * Type definitions for:
 * - User entities
 * - User CRUD operations
 * - Role-based access control
 */

// ==================== USER TYPES ====================

/**
 * User entity
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  schoolId?: string;
  districtId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create user request
 */
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  districtId?: string;
}

/**
 * Update user request
 */
export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  schoolId?: string;
  districtId?: string;
}
