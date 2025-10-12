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
