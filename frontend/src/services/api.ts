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

export default api