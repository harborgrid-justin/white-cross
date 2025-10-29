/**
 * API Client
 *
 * Centralized API client for making HTTP requests.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface ApiClientOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
}

/**
 * Make an API request
 */
export async function apiClient(endpoint: string, options: ApiClientOptions = {}) {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Alias for apiClient
 */
export const fetchApi = apiClient

export default apiClient
