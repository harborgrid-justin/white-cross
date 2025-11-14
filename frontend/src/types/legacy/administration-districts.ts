/**
 * WF-COMP-315 | administration-districts.ts - District and School Type Definitions
 * Purpose: Type definitions for district and school management
 * Upstream: administration-enums.ts, administration-licenses.ts | Dependencies: None
 * Downstream: District/School management components | Called by: Admin UI components
 * Related: administration-users.ts, administration-config.ts
 * Exports: District and School entity types, CRUD interfaces
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: District/School entity management
 * LLM Context: Type definitions for district and school entities
 */

import type { License } from './administration-licenses';

/**
 * District and School Management Types
 *
 * Type definitions for:
 * - District entities and relationships
 * - School entities and relationships
 * - CRUD operations for districts and schools
 */

// ==================== DISTRICT TYPES ====================

/**
 * District entity
 *
 * @aligned_with backend/src/database/models/administration/District.ts
 */
export interface District {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Frontend-only relationship fields
  schools?: School[];
  licenses?: License[];
}

/**
 * Create district request
 */
export interface CreateDistrictData {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
}

/**
 * Update district request
 */
export interface UpdateDistrictData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
}

// ==================== SCHOOL TYPES ====================

/**
 * School entity
 *
 * @aligned_with backend/src/database/models/administration/School.ts
 */
export interface School {
  id: string;
  name: string;
  code: string;
  districtId: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Frontend-only relationship field
  district?: {
    id: string;
    name: string;
    code: string;
  };
}

/**
 * Create school request
 */
export interface CreateSchoolData {
  name: string;
  code: string;
  districtId: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
}

/**
 * Update school request
 */
export interface UpdateSchoolData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
  isActive?: boolean;
}
