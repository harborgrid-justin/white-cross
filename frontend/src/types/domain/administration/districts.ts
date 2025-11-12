/**
 * WF-COMP-315 | administration/districts.ts - Type definitions
 * Purpose: District and School type definitions for administration module
 * Upstream: enums.ts | Dependencies: None
 * Downstream: District and School management components | Called by: React components
 * Related: Other administration type files
 * Exports: Interfaces | Key Features: Type definitions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions for district and school management
 * LLM Context: District and School types, part of administration refactoring
 */

import type { License } from './licenses';

/**
 * District and School Management Types
 *
 * Type definitions for district and school entities including:
 * - Core entity types aligned with backend models
 * - Create/update request types
 * - Relationship definitions
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
