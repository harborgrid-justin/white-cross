/**
 * WF-COMP-160 | types.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

export type ViewMode = 'calendar' | 'list' | 'waitlist' | 'availability'

export interface AppointmentFilters {
  filterStatus: string
  filterType: string
  dateFrom: string
  dateTo: string
}

export type AppointmentSortColumn = 'scheduledAt' | 'type' | 'status' | 'studentName'

export interface AppointmentStatistics {
  total: number
  completionRate: number
  noShowRate: number
  scheduledToday: number
}
