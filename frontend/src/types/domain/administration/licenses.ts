/**
 * WF-COMP-315 | administration/licenses.ts - Type definitions
 * Purpose: License management type definitions for administration module
 * Upstream: enums.ts | Dependencies: LicenseType, LicenseStatus
 * Downstream: License management components | Called by: React components
 * Related: districts.ts, other administration type files
 * Exports: Interfaces | Key Features: Type definitions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions for license management
 * LLM Context: License management types with feature control
 */

import type { LicenseType, LicenseStatus } from './enums';

/**
 * License Management Types
 *
 * Type definitions for license management including:
 * - License entities aligned with backend models
 * - Create/update request types
 * - Feature control and limitations
 */

// ==================== LICENSE MANAGEMENT TYPES ====================

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
