/**
 * WF-COMP-315 | administration-licenses.ts - License Management Type Definitions
 * Purpose: Type definitions for software license management
 * Upstream: administration-enums.ts | Dependencies: None
 * Downstream: License management components | Called by: Admin licensing UI
 * Related: administration-districts.ts (licenses are associated with districts)
 * Exports: License entity types, CRUD interfaces
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: License management and feature control
 * LLM Context: Type definitions for license management with feature flags
 */

import type { LicenseType, LicenseStatus } from './administration-enums';

/**
 * License Management Types
 *
 * Type definitions for:
 * - License entities and relationships
 * - License CRUD operations
 * - Feature control through licensing
 */

// ==================== LICENSE TYPES ====================

/**
 * License entity
 *
 * @aligned_with backend/src/database/models/administration/License.ts
 */
export interface License {
  id: string;
  licenseKey: string;
  type: LicenseType;
  status: LicenseStatus;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  issuedAt: string;
  expiresAt?: string;
  activatedAt?: string;
  deactivatedAt?: string;
  notes?: string;
  districtId?: string;
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
 * Create license request
 */
export interface CreateLicenseData {
  licenseKey: string;
  type: LicenseType;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  expiresAt?: Date | string;
  districtId?: string;
  notes?: string;
}

/**
 * Update license request
 */
export interface UpdateLicenseData {
  licenseKey?: string;
  type?: LicenseType;
  status?: LicenseStatus;
  maxUsers?: number;
  maxSchools?: number;
  features?: string[];
  issuedTo?: string;
  expiresAt?: Date | string;
  districtId?: string;
  notes?: string;
}
