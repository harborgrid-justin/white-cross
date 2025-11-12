/**
 * WF-COMP-327 | integrations.ts - Integration Types Module
 * Purpose: Re-export all integration types from modular subdirectory
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: All integration types, enums, interfaces, utilities | Key Features: Modular type architecture
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type imports → Module resolution → Type checking
 * LLM Context: Integration types module, refactored from 904-line monolith to modular structure
 *
 * @fileoverview Integration Hub Type Definitions - Re-export Module
 * @module types/domain/integrations
 * @category Healthcare - Integration Management
 *
 * This module serves as the main entry point for all integration-related types.
 * Previously a 904-line monolithic file, now refactored into focused modules:
 *
 * - common.ts: Shared type utilities (JsonValue, UnknownRecord)
 * - core.ts: Core types, enums, and utility functions
 * - config.ts: Configuration types and provider-specific settings
 * - sync.ts: Synchronization, credentials, webhooks, and statistics
 * - api.ts: API request/response types and error handling
 *
 * All types maintain backward compatibility with previous imports.
 * Import from this file continues to work as before.
 *
 * @example
 * ```typescript
 * // All imports work exactly as before
 * import { IntegrationType, IntegrationConfig, SyncStatus } from '@/types/domain/integrations';
 * import type { CreateIntegrationRequest } from '@/types/domain/integrations';
 * ```
 */

// Re-export everything from the index module
// This maintains complete backward compatibility
export * from './integrations/index';

// ==================== BACKWARD COMPATIBILITY NOTES ====================
//
// This file was refactored on 2025-11-12 from a 904-line monolithic file
// into a modular structure for better maintainability.
//
// All existing imports continue to work without changes:
// - All enums (IntegrationType, IntegrationStatus, SyncStatus, etc.)
// - All interfaces (IntegrationConfig, IntegrationLog, etc.)
// - All type guards (isIntegrationActive, isSyncSuccessful, etc.)
// - All utility functions (getIntegrationTypeDisplay, formatSyncDuration, etc.)
//
// New modular structure:
// - frontend/src/types/domain/integrations/common.ts (38 lines)
// - frontend/src/types/domain/integrations/core.ts (329 lines)
// - frontend/src/types/domain/integrations/config.ts (324 lines)
// - frontend/src/types/domain/integrations/sync.ts (296 lines)
// - frontend/src/types/domain/integrations/api.ts (296 lines)
// - frontend/src/types/domain/integrations/index.ts (183 lines)
//
// Type Safety Improvements:
// - Replaced `any` types with `JsonValue` for JSON-serializable data
// - Replaced `any` types with `UnknownRecord` for dynamic objects
// - Replaced `any` types with `unknown` in index signatures
// - All modules now have proper type safety without sacrificing flexibility
//
// ==================== END BACKWARD COMPATIBILITY NOTES ====================
