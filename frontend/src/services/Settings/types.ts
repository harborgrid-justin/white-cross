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
