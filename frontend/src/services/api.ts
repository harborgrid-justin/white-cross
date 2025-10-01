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