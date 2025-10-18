/**
 * WF-COMP-170 | types.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

export interface DashboardStats {
  totalStudents: number
  activeMedications: number
  todaysAppointments: number
  pendingIncidents: number
  medicationsDueToday: number
  healthAlerts: number
  recentActivityCount: number
  studentTrend: TrendData
  medicationTrend: TrendData
  appointmentTrend: TrendData
}

export interface TrendData {
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
}

export interface RecentActivity {
  id: string
  type: 'medication' | 'incident' | 'appointment'
  message: string
  time: string
  status: 'completed' | 'pending' | 'warning' | 'upcoming'
}

export interface UpcomingAppointment {
  id: string
  student: string
  studentId: string
  time: string
  type: string
  priority: 'high' | 'medium' | 'low'
}

export type TimePeriod = 'week' | 'month' | 'year'
