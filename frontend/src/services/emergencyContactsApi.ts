import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001'

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

export const emergencyContactsApi = {
  // Get contacts for a student
  getByStudent: async (studentId: string) => {
    const response = await api.get(`/emergency-contacts/student/${studentId}`)
    return response.data.data
  },

  // Create new contact
  create: async (data: any) => {
    const response = await api.post('/emergency-contacts', data)
    return response.data.data
  },

  // Update contact
  update: async (id: string, data: any) => {
    const response = await api.put(`/emergency-contacts/${id}`, data)
    return response.data.data
  },

  // Delete contact
  delete: async (id: string) => {
    const response = await api.delete(`/emergency-contacts/${id}`)
    return response.data
  },

  // Send emergency notification
  notifyStudent: async (studentId: string, notification: any) => {
    const response = await api.post(`/emergency-contacts/notify/${studentId}`, notification)
    return response.data.data
  },

  // Send notification to specific contact
  notifyContact: async (contactId: string, notification: any) => {
    const response = await api.post(`/emergency-contacts/notify/contact/${contactId}`, notification)
    return response.data.data
  },

  // Verify contact
  verify: async (contactId: string, method: 'sms' | 'email' | 'voice') => {
    const response = await api.post(`/emergency-contacts/verify/${contactId}`, { method })
    return response.data.data
  },

  // Get statistics
  getStatistics: async () => {
    const response = await api.get('/emergency-contacts/statistics')
    return response.data.data
  },
}
