/**
 * WF-COMP-315 | administration/configuration.ts - Type definitions
 * Purpose: System configuration type definitions for administration module
 * Upstream: enums.ts | Dependencies: ConfigCategory, ConfigValueType, ConfigScope
 * Downstream: Configuration management components | Called by: React components
 * Related: Other administration type files
 * Exports: Interfaces | Key Features: Type definitions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions for system configuration management
 * LLM Context: System configuration types with history tracking
 */

import type { ConfigCategory, ConfigValueType, ConfigScope } from './enums';

/**
 * System Configuration Types
 *
 * Type definitions for system configuration including:
 * - Configuration entities aligned with backend models
 * - Configuration history tracking
 * - Settings organization and grouping
 */

// ==================== SYSTEM CONFIGURATION TYPES ====================

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
