/**
 * Shared Store Utilities
 * 
 * Cross-cutting concerns and shared functionality that doesn't belong to a specific domain.
 * Includes API integrations, orchestration, enterprise features, and legacy code.
 * 
 * @module stores/shared
 */

// ==========================================
// API INTEGRATIONS
// ==========================================
export * from './api';

// ==========================================
// ENTERPRISE FEATURES
// ==========================================
export * from './enterprise';

// ==========================================
// ORCHESTRATION
// ==========================================
export * from './orchestration';

// ==========================================
// LEGACY CODE (DEPRECATED)
// ==========================================
// These exports are maintained for backward compatibility
// and should be migrated to domain-based architecture
export * from './legacy';