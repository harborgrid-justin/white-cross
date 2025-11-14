/**
 * WF-COMP-315 | administration-config.ts - System Configuration Type Definitions
 * Purpose: Type definitions for system configuration and settings management
 * Upstream: administration-enums.ts | Dependencies: None
 * Downstream: Configuration management components | Called by: Admin settings UI
 * Related: administration-audit.ts (configuration changes are audited)
 * Exports: Configuration entity types, history tracking, settings interfaces
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: System configuration management
 * LLM Context: Type definitions for system configuration with history tracking
 */

import type { ConfigCategory, ConfigValueType, ConfigScope } from './administration-enums';

/**
 * System Configuration Types
 *
 * Type definitions for:
 * - System configuration entities
 * - Configuration history tracking
 * - Settings management and grouping
 */

// ==================== CONFIGURATION TYPES ====================

/**
 * System configuration entity
 *
 * @aligned_with backend/src/database/models/administration/SystemConfiguration.ts
 */
export interface SystemConfiguration {
  id: string;
  key: string;
  value: string;
  valueType: ConfigValueType;
  category: ConfigCategory;
  subCategory?: string;
  description?: string;
  defaultValue?: string;
  validValues: string[];
  minValue?: number;
  maxValue?: number;
  isPublic: boolean;
  isEditable: boolean;
  requiresRestart: boolean;
  scope: ConfigScope;
  scopeId?: string;
  tags: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Configuration history tracking
 *
 * @aligned_with backend/src/database/models/administration/ConfigurationHistory.ts
 */
export interface ConfigurationHistory {
  id: string;
  configurationId: string;
  configKey: string;
  oldValue?: string;
  newValue: string;
  changedBy: string;
  changedByName?: string;
  changeReason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

/**
 * Configuration data for create/update
 */
export interface ConfigurationData {
  key: string;
  value: string;
  category: ConfigCategory;
  valueType?: ConfigValueType;
  subCategory?: string;
  description?: string;
  isPublic?: boolean;
  isEditable?: boolean;
  requiresRestart?: boolean;
  scope?: ConfigScope;
  scopeId?: string;
  tags?: string[];
  sortOrder?: number;
}

/**
 * System settings grouped by category
 */
export interface SystemSettings {
  [category: string]: SystemSettingItem[];
}

/**
 * Individual setting item
 */
export interface SystemSettingItem {
  key: string;
  value: string;
  valueType: ConfigValueType;
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
  requiresRestart: boolean;
  category: ConfigCategory;
  subCategory?: string;
  scope?: ConfigScope;
  tags?: string[];
}
