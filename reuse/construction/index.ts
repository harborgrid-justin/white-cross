/**
 * File: /reuse/construction/index.ts
 * Purpose: Barrel export for Construction domain utility kits
 *
 * Provides centralized access to all construction management kits for
 * USACE EPPM-level construction project management capabilities.
 *
 * @module Construction
 * @version 1.0.0
 *
 * @example
 * ```typescript
 * // Import specific kits
 * import {
 *   createProject,
 *   trackProgress,
 *   manageBid
 * } from '@construction';
 *
 * // Or import from specific kit
 * import { createProject } from '@construction/construction-project-management-kit';
 * ```
 */

// ============================================================================
// CONSTRUCTION DOMAIN TYPES
// ============================================================================
export * from './types';

// ============================================================================
// PROJECT MANAGEMENT
// ============================================================================
export * from './construction-project-management-kit';
export * from './construction-progress-tracking-kit';
export * from './construction-closeout-management-kit';

// ============================================================================
// CONTRACT & BID MANAGEMENT
// ============================================================================
export * from './construction-bid-management-kit';
export * from './construction-contract-administration-kit';
export * from './construction-change-order-management-kit';

// ============================================================================
// RESOURCE MANAGEMENT
// ============================================================================
export * from './construction-labor-management-kit';
export * from './construction-material-management-kit';
export * from './construction-equipment-management-kit';

// ============================================================================
// QUALITY & SAFETY
// ============================================================================
export * from './construction-quality-control-kit';
export * from './construction-safety-management-kit';
export * from './construction-inspection-management-kit';

// ============================================================================
// DOCUMENTATION
// ============================================================================
export * from './construction-document-control-kit';
export * from './construction-submittal-management-kit';
export * from './construction-warranty-management-kit';

// ============================================================================
// SCHEDULING & SITE MANAGEMENT
// ============================================================================
export * from './construction-schedule-management-kit';
export * from './construction-site-management-kit';

// ============================================================================
// FINANCIAL MANAGEMENT
// ============================================================================
export * from './construction-cost-control-kit';
