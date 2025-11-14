/**
 * WF-COMP-332 | reports.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces | Key Features: Standard module
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Report Types and Interfaces for White Cross Healthcare Platform
 * 
 * This file has been refactored to use a modular architecture while maintaining
 * backward compatibility. All types are now organized into focused modules under
 * ./reports/ directory but re-exported here for existing code.
 * 
 * Modular structure:
 * - enums.ts: Core enumeration types
 * - filters.ts: Common filter interfaces
 * - health-trends.ts: Health trends analysis types
 * - medication-usage.ts: Medication tracking types
 * - incidents.ts: Incident reporting and statistics
 * - performance.ts: Performance and compliance metrics
 * - dashboard.ts: Dashboard and custom reports
 * - analytics.ts: Analytics and visualization types
 */

// Re-export all types from the modular structure for backward compatibility
export * from './reports/index';

// Legacy aliases for backward compatibility (if any breaking changes occurred)
// Add any necessary type aliases here to maintain compatibility with existing code
