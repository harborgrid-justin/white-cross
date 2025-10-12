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
