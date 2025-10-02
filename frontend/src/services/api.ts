import axios from 'axios'
import { User, Student, ApiResponse } from '../types'
import toast from 'react-hot-toast'

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001'

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    const message = error.response?.data?.error?.message || 'An error occurred'
    toast.error(message)
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', {
      email,
      password,
    })
    return response.data.data!
  },

  register: async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: string
  }): Promise<{ user: User }> => {
    const response = await api.post<ApiResponse<{ user: User }>>('/auth/register', userData)
    return response.data.data!
  },

  verifyToken: async (): Promise<User> => {
    // This would be implemented to verify the current token
    // For now, we'll extract user info from the token
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found')
    }
    
    // In a real implementation, you would decode the JWT or make an API call
    // For now, return mock data
    return {
      id: '1',
      email: 'nurse@school.edu',
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'NURSE'
    }
  },
}

// Medications API
export const medicationsApi = {
  getAll: async (page = 1, limit = 20, search?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (search) params.append('search', search)
    const response = await api.get(`/medications?${params}`)
    return response.data.data
  },

  create: async (medicationData: any) => {
    const response = await api.post('/medications', medicationData)
    return response.data.data
  },

  assignToStudent: async (data: any) => {
    const response = await api.post('/medications/assign', data)
    return response.data.data
  },

  logAdministration: async (data: any) => {
    const response = await api.post('/medications/administration', data)
    return response.data.data
  },

  getStudentLogs: async (studentId: string, page = 1, limit = 20) => {
    const response = await api.get(`/medications/logs/${studentId}?page=${page}&limit=${limit}`)
    return response.data.data
  },

  getInventory: async () => {
    const response = await api.get('/medications/inventory')
    return response.data.data
  },

  addToInventory: async (data: any) => {
    const response = await api.post('/medications/inventory', data)
    return response.data.data
  },

  updateInventory: async (id: string, quantity: number, reason?: string) => {
    const response = await api.put(`/medications/inventory/${id}`, { quantity, reason })
    return response.data.data
  },

  getSchedule: async (startDate?: Date, endDate?: Date, nurseId?: string) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate.toISOString())
    if (endDate) params.append('endDate', endDate.toISOString())
    if (nurseId) params.append('nurseId', nurseId)
    const response = await api.get(`/medications/schedule?${params}`)
    return response.data.data
  },

  getReminders: async (date?: Date) => {
    const params = date ? `?date=${date.toISOString()}` : ''
    const response = await api.get(`/medications/reminders${params}`)
    return response.data.data
  },

  reportAdverseReaction: async (data: any) => {
    const response = await api.post('/medications/adverse-reaction', data)
    return response.data.data
  },

  getAdverseReactions: async (medicationId?: string, studentId?: string) => {
    const params = new URLSearchParams()
    if (medicationId) params.append('medicationId', medicationId)
    if (studentId) params.append('studentId', studentId)
    const response = await api.get(`/medications/adverse-reactions?${params}`)
    return response.data.data
  },

  deactivateStudentMedication: async (id: string, reason?: string) => {
    const response = await api.put(`/medications/student-medication/${id}/deactivate`, { reason })
    return response.data.data
  }
}

// Students API
export const studentsApi = {
  getAll: async (page = 1, limit = 10): Promise<{
    students: Student[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> => {
    const response = await api.get<ApiResponse<{
      students: Student[]
      pagination: any
    }>>(`/students?page=${page}&limit=${limit}`)
    return response.data.data!
  },

  getById: async (id: string): Promise<{ student: Student }> => {
    const response = await api.get<ApiResponse<{ student: Student }>>(`/students/${id}`)
    return response.data.data!
  },

  create: async (studentData: Partial<Student>): Promise<{ student: Student }> => {
    const response = await api.post<ApiResponse<{ student: Student }>>('/students', studentData)
    return response.data.data!
  },

  update: async (id: string, studentData: Partial<Student>): Promise<{ student: Student }> => {
    const response = await api.put<ApiResponse<{ student: Student }>>(`/students/${id}`, studentData)
    return response.data.data!
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}`)
  },
}

// Inventory API
export const inventoryApi = {
  getItems: async (page = 1, limit = 20, filters?: any) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) params.append(key, filters[key].toString())
      })
    }
    const response = await api.get(`/inventory?${params}`)
    return response.data.data
  },

  getItemById: async (id: string) => {
    const response = await api.get(`/inventory/${id}`)
    return response.data.data
  },

  createItem: async (data: any) => {
    const response = await api.post('/inventory', data)
    return response.data.data
  },

  updateItem: async (id: string, data: any) => {
    const response = await api.put(`/inventory/${id}`, data)
    return response.data.data
  },

  createTransaction: async (data: any) => {
    const response = await api.post('/inventory/transactions', data)
    return response.data.data
  },

  getAlerts: async () => {
    const response = await api.get('/inventory/alerts')
    return response.data.data
  },

  createMaintenanceLog: async (data: any) => {
    const response = await api.post('/inventory/maintenance', data)
    return response.data.data
  },

  getMaintenanceSchedule: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    const response = await api.get(`/inventory/maintenance/schedule?${params}`)
    return response.data.data
  },

  getValuation: async () => {
    const response = await api.get('/inventory/valuation')
    return response.data.data
  },

  getUsageAnalytics: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    const response = await api.get(`/inventory/analytics/usage?${params}`)
    return response.data.data
  },

  getSupplierPerformance: async () => {
    const response = await api.get('/inventory/analytics/suppliers')
    return response.data.data
  },

  searchItems: async (query: string, limit = 20) => {
    const response = await api.get(`/inventory/search/${query}?limit=${limit}`)
    return response.data.data
  },

  getCurrentStock: async (id: string) => {
    const response = await api.get(`/inventory/${id}/stock`)
    return response.data.data
  }
}

// Vendor API
export const vendorApi = {
  getAll: async (page = 1, limit = 20, activeOnly = true) => {
    const response = await api.get(`/vendors?page=${page}&limit=${limit}&activeOnly=${activeOnly}`)
    return response.data.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/vendors/${id}`)
    return response.data.data
  },

  create: async (data: any) => {
    const response = await api.post('/vendors', data)
    return response.data.data
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/vendors/${id}`, data)
    return response.data.data
  },

  compare: async (itemName: string) => {
    const response = await api.get(`/vendors/compare/${itemName}`)
    return response.data.data
  },

  search: async (query: string, limit = 20) => {
    const response = await api.get(`/vendors/search/${query}?limit=${limit}`)
    return response.data.data
  }
}

// Purchase Order API
export const purchaseOrderApi = {
  getAll: async (page = 1, limit = 20, filters?: any) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) params.append(key, filters[key].toString())
      })
    }
    const response = await api.get(`/purchase-orders?${params}`)
    return response.data.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/purchase-orders/${id}`)
    return response.data.data
  },

  create: async (data: any) => {
    const response = await api.post('/purchase-orders', data)
    return response.data.data
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/purchase-orders/${id}`, data)
    return response.data.data
  },

  approve: async (id: string) => {
    const response = await api.post(`/purchase-orders/${id}/approve`)
    return response.data.data
  },

  receiveItems: async (id: string, items: any) => {
    const response = await api.post(`/purchase-orders/${id}/receive`, { items })
    return response.data.data
  },

  cancel: async (id: string, reason?: string) => {
    const response = await api.post(`/purchase-orders/${id}/cancel`, { reason })
    return response.data.data
  },

  getItemsNeedingReorder: async () => {
    const response = await api.get('/purchase-orders/reorder/needed')
    return response.data.data
  }
}

// Budget API
export const budgetApi = {
  getCategories: async (fiscalYear?: number, activeOnly = true) => {
    const params = new URLSearchParams()
    if (fiscalYear) params.append('fiscalYear', fiscalYear.toString())
    params.append('activeOnly', activeOnly.toString())
    const response = await api.get(`/budget/categories?${params}`)
    return response.data.data
  },

  getCategoryById: async (id: string) => {
    const response = await api.get(`/budget/categories/${id}`)
    return response.data.data
  },

  createCategory: async (data: any) => {
    const response = await api.post('/budget/categories', data)
    return response.data.data
  },

  updateCategory: async (id: string, data: any) => {
    const response = await api.put(`/budget/categories/${id}`, data)
    return response.data.data
  },

  getSummary: async (fiscalYear?: number) => {
    const params = fiscalYear ? `?fiscalYear=${fiscalYear}` : ''
    const response = await api.get(`/budget/summary${params}`)
    return response.data.data
  },

  getTransactions: async (page = 1, limit = 20, filters?: any) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) params.append(key, filters[key].toString())
      })
    }
    const response = await api.get(`/budget/transactions?${params}`)
    return response.data.data
  },

  createTransaction: async (data: any) => {
    const response = await api.post('/budget/transactions', data)
    return response.data.data
  },

  getTrends: async (fiscalYear?: number, categoryId?: string) => {
    const params = new URLSearchParams()
    if (fiscalYear) params.append('fiscalYear', fiscalYear.toString())
    if (categoryId) params.append('categoryId', categoryId)
    const response = await api.get(`/budget/trends?${params}`)
    return response.data.data
  }
}

// Appointments API
export const appointmentsApi = {
  getAll: async (filters?: {
    page?: number
    limit?: number
    nurseId?: string
    studentId?: string
    status?: string
    type?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<{
    appointments: any[]
    pagination: any
  }> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value))
      })
    }
    const response = await api.get<ApiResponse<{
      appointments: any[]
      pagination: any
    }>>(`/appointments?${params.toString()}`)
    return response.data.data!
  },

  create: async (appointmentData: {
    studentId: string
    nurseId: string
    type: string
    scheduledAt: string
    reason: string
    duration?: number
    notes?: string
  }): Promise<{ appointment: any }> => {
    const response = await api.post<ApiResponse<{ appointment: any }>>('/appointments', appointmentData)
    return response.data.data!
  },

  update: async (id: string, data: any): Promise<{ appointment: any }> => {
    const response = await api.put<ApiResponse<{ appointment: any }>>(`/appointments/${id}`, data)
    return response.data.data!
  },

  cancel: async (id: string, reason?: string): Promise<{ appointment: any }> => {
    const response = await api.put<ApiResponse<{ appointment: any }>>(`/appointments/${id}/cancel`, { reason })
    return response.data.data!
  },

  markNoShow: async (id: string): Promise<{ appointment: any }> => {
    const response = await api.put<ApiResponse<{ appointment: any }>>(`/appointments/${id}/no-show`, {})
    return response.data.data!
  },

  getAvailability: async (nurseId: string, date?: string, duration?: number): Promise<{ slots: any[] }> => {
    const params = new URLSearchParams()
    if (date) params.append('date', date)
    if (duration) params.append('duration', String(duration))
    const response = await api.get<ApiResponse<{ slots: any[] }>>(`/appointments/availability/${nurseId}?${params.toString()}`)
    return response.data.data!
  },

  getUpcoming: async (nurseId: string, limit?: number): Promise<{ appointments: any[] }> => {
    const params = limit ? `?limit=${limit}` : ''
    const response = await api.get<ApiResponse<{ appointments: any[] }>>(`/appointments/upcoming/${nurseId}${params}`)
    return response.data.data!
  },

  getStatistics: async (filters?: {
    nurseId?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<any> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value)
      })
    }
    const response = await api.get<ApiResponse<any>>(`/appointments/statistics?${params.toString()}`)
    return response.data.data!
  },

  createRecurring: async (data: {
    studentId: string
    nurseId: string
    type: string
    scheduledAt: string
    reason: string
    duration?: number
    recurrence: {
      frequency: 'daily' | 'weekly' | 'monthly'
      interval: number
      endDate: string
      daysOfWeek?: number[]
    }
  }): Promise<{ appointments: any[]; count: number }> => {
    const response = await api.post<ApiResponse<{ appointments: any[]; count: number }>>('/appointments/recurring', data)
    return response.data.data!
  },

  // Nurse Availability
  setAvailability: async (data: {
    nurseId: string
    startTime: string
    endTime: string
    dayOfWeek?: number
    isRecurring?: boolean
    specificDate?: string
    isAvailable?: boolean
    reason?: string
  }): Promise<{ availability: any }> => {
    const response = await api.post<ApiResponse<{ availability: any }>>('/appointments/availability', data)
    return response.data.data!
  },

  getNurseAvailability: async (nurseId: string, date?: string): Promise<{ availability: any[] }> => {
    const params = date ? `?date=${date}` : ''
    const response = await api.get<ApiResponse<{ availability: any[] }>>(`/appointments/availability/nurse/${nurseId}${params}`)
    return response.data.data!
  },

  updateAvailability: async (id: string, data: any): Promise<{ availability: any }> => {
    const response = await api.put<ApiResponse<{ availability: any }>>(`/appointments/availability/${id}`, data)
    return response.data.data!
  },

  deleteAvailability: async (id: string): Promise<void> => {
    await api.delete(`/appointments/availability/${id}`)
  },

  // Waitlist
  addToWaitlist: async (data: {
    studentId: string
    nurseId?: string
    type: string
    reason: string
    priority?: string
    preferredDate?: string
    duration?: number
    notes?: string
  }): Promise<{ entry: any }> => {
    const response = await api.post<ApiResponse<{ entry: any }>>('/appointments/waitlist', data)
    return response.data.data!
  },

  getWaitlist: async (filters?: {
    nurseId?: string
    status?: string
    priority?: string
  }): Promise<{ waitlist: any[] }> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value)
      })
    }
    const response = await api.get<ApiResponse<{ waitlist: any[] }>>(`/appointments/waitlist?${params.toString()}`)
    return response.data.data!
  },

  removeFromWaitlist: async (id: string, reason?: string): Promise<{ entry: any }> => {
    const response = await api.delete<ApiResponse<{ entry: any }>>(`/appointments/waitlist/${id}`, {
      data: { reason }
    })
    return response.data.data!
  },

  // Calendar Export
  exportCalendar: async (nurseId: string, dateFrom?: string, dateTo?: string): Promise<Blob> => {
    const params = new URLSearchParams()
    if (dateFrom) params.append('dateFrom', dateFrom)
    if (dateTo) params.append('dateTo', dateTo)
    const response = await api.get(`/appointments/calendar/${nurseId}?${params.toString()}`, {
      responseType: 'blob'
    })
    return response.data
  }
}

export default api