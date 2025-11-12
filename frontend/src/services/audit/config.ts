/**
 * @fileoverview HIPAA-Compliant Audit Logging System - Configuration Index
 *
 * This module serves as the main entry point for audit configuration, re-exporting
 * all configuration constants, mappings, and utility functions from specialized
 * sub-modules. This barrel file maintains backward compatibility while organizing
 * configuration into logical, maintainable modules.
 *
 * @module AuditConfig
 * @version 1.0.0
 * @since 2025-10-21
 *
 * @description
 * This configuration index provides centralized access to:
 * - **Default Configuration**: System-wide audit settings and parameters
 * - **Severity Classification**: Action-to-severity mappings and utilities
 * - **PHI Classification**: Resource PHI status and HIPAA compliance
 * - **Critical Event Logic**: Immediate processing determination
 *
 * **Module Organization:**
 * - `config.defaults.ts`: DEFAULT_AUDIT_CONFIG constant
 * - `config.severity.ts`: Severity mappings and utilities
 * - `config.phi.ts`: PHI classification and utilities
 * - `config.critical.ts`: Critical event determination
 *
 * **Export Categories:**
 * - **Constants**: DEFAULT_AUDIT_CONFIG, ACTION_SEVERITY_MAP, RESOURCE_PHI_MAP
 * - **Severity Functions**: isCriticalSeverity, getActionSeverity
 * - **PHI Functions**: isResourcePHI
 * - **Critical Functions**: isCriticalAction, requiresImmediateFlush
 *
 * @example Import Configuration
 * ```typescript
 * import { DEFAULT_AUDIT_CONFIG } from '@/services/audit/config';
 * ```
 *
 * @example Import Utilities
 * ```typescript
 * import {
 *   getActionSeverity,
 *   isResourcePHI,
 *   requiresImmediateFlush
 * } from '@/services/audit/config';
 * ```
 *
 * @example Import All
 * ```typescript
 * import * as AuditConfig from '@/services/audit/config';
 *
 * const config = AuditConfig.DEFAULT_AUDIT_CONFIG;
 * const severity = AuditConfig.getActionSeverity(action);
 * ```
 *
 * @author Healthcare Development Team
 * @copyright 2025 White Cross Health Systems
 * @license Proprietary - Internal Use Only
 *
 * @requires HIPAA Compliance Review
 *
 * @see {@link config.defaults} for default configuration
 * @see {@link config.severity} for severity classification
 * @see {@link config.phi} for PHI classification
 * @see {@link config.critical} for critical event logic
 */

// ==========================================
// DEFAULT CONFIGURATION
// ==========================================
// System-wide audit configuration settings

export { DEFAULT_AUDIT_CONFIG } from './config.defaults';

// ==========================================
// SEVERITY CLASSIFICATION
// ==========================================
// Action severity mappings and utility functions

export { ACTION_SEVERITY_MAP, isCriticalSeverity, getActionSeverity } from './config.severity';

// ==========================================
// PHI CLASSIFICATION
// ==========================================
// Protected Health Information detection and classification

export { RESOURCE_PHI_MAP, isResourcePHI } from './config.phi';

// ==========================================
// CRITICAL EVENT DETERMINATION
// ==========================================
// Critical event identification and immediate processing logic

export { isCriticalAction, requiresImmediateFlush } from './config.critical';
