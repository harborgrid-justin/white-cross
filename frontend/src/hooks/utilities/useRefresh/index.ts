/**
 * WF-COMP-145 | index.ts - Refresh utilities barrel export
 * Purpose: Central export point for refresh and polling utilities
 * Upstream: All useRefresh modules | Dependencies: React, Next.js
 * Downstream: Main useRefresh.ts hook | Called by: useRefresh.ts
 * Related: Data fetching, polling, visibility management
 * Exports: Types and internal utilities | Key Features: Module composition
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import resolution → Module re-export → Hook composition
 * LLM Context: Internal barrel export for useRefresh.ts composition
 *
 * NOTE: This file exports internal utilities used by the main useRefresh.ts hook.
 * External consumers should import from useRefresh.ts, not this directory.
 */

'use client';

// =====================
// TYPE DEFINITIONS
// =====================
export type {
  UseRefreshOptions,
  UseRefreshReturn,
} from './types';

// =====================
// INTERNAL UTILITIES
// =====================
// These are exported for the main useRefresh.ts hook to compose
// External consumers should not import these directly

export {
  useSimpleRefresh,
  useManualRefresh,
} from './manualRefresh';

export {
  usePauseResume,
  useAutoRefreshInterval,
} from './autoRefresh';

export {
  useVisibilityManager,
} from './visibilityManager';
