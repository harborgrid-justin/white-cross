/**
 * WF-COMP-315 | administration/users.ts - Type definitions
 * Purpose: User management type definitions for administration module
 * Upstream: enums.ts | Dependencies: UserRole
 * Downstream: User management components | Called by: React components
 * Related: Other administration type files
 * Exports: Interfaces | Key Features: Type definitions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions for user management
 * LLM Context: User management types with role-based access
 */

import type { UserRole } from './enums';

/**
 * User Management Types
 *
 * Type definitions for user management including:
 * - User entities
 * - Create/update request types
 * - Role and access control
 */

// ==================== USER MANAGEMENT TYPES ====================

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
