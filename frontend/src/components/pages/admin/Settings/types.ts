/**
 * WF-COMP-300 | types.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Settings Page Types
 *
 * Type definitions for the Administration Panel module
 * @module pages/Settings/types
 */

export type SettingsTab =
  | 'overview'
  | 'districts'
  | 'schools'
  | 'users'
  | 'config'
  | 'integrations'
  | 'backups'
  | 'monitoring'
  | 'licenses'
  | 'training'
  | 'audit'

export interface SystemHealth {
  status: string
  services: Record<string, { status: string; latency?: number }>
  database: { status: string; connections?: number }
  cache: { status: string; hitRate?: number }
}
