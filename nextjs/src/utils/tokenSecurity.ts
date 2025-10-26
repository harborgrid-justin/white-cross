/**
 * WF-COMP-354 | tokenSecurity.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../types | Dependencies: ../types
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Secure token management utilities for healthcare platform
 * Implements encryption, expiration checking, and secure storage patterns
 */

import { User } from '../types'

export interface TokenData {
  token: string
  user: User
  expiresAt: number
  issuedAt: number
}

export interface EncryptedTokenData {
  data: string
  iv: string
  timestamp: number
}

/**
 * Simple encryption utility using Web Crypto API
 * Note: For production, consider using a more robust solution like storing tokens in httpOnly cookies
 */
class TokenSecurityManager {
  private readonly STORAGE_KEY = 'auth_data'
  private readonly ENCRYPTION_KEY_NAME = 'auth_encryption_key'
  private readonly TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000 // 5 minutes buffer
  private encryptionKey: CryptoKey | null = null

  async init(): Promise<void> {
    try {
      // Generate or retrieve encryption key
      const keyData = localStorage.getItem(this.ENCRYPTION_KEY_NAME)
      if (keyData) {
        const keyBuffer = this.base64ToArrayBuffer(keyData)
        this.encryptionKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        )
      } else {
        await this.generateNewKey()
      }
    } catch (error) {
      console.error('Failed to initialize token security:', error)
      // Fallback to unencrypted storage with warning
      console.warn('Using unencrypted token storage - consider implementing httpOnly cookies')
    }
  }

  private async generateNewKey(): Promise<void> {
    this.encryptionKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )

    const keyBuffer = await crypto.subtle.exportKey('raw', this.encryptionKey)
    localStorage.setItem(this.ENCRYPTION_KEY_NAME, this.arrayBufferToBase64(keyBuffer))
  }

  /**
   * Stores token with encryption and expiration metadata
   */
  async storeToken(token: string, user: User, expiresIn: number = 24 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now()
    const tokenData: TokenData = {
      token,
      user,
      expiresAt: now + expiresIn,
      issuedAt: now
    }

    try {
      if (this.encryptionKey) {
        const encrypted = await this.encryptData(JSON.stringify(tokenData))
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(encrypted))
      } else {
        // Fallback to unencrypted storage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokenData))
      }
    } catch (error) {
      console.error('Failed to store encrypted token:', error)
      throw new Error('Token storage failed')
    }
  }

  /**
   * Retrieves and validates stored token
   */
  async getValidToken(): Promise<TokenData | null> {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY)
      if (!storedData) return null

      let tokenData: TokenData

      if (this.encryptionKey) {
        try {
          const encryptedData: EncryptedTokenData = JSON.parse(storedData)
          const decryptedString = await this.decryptData(encryptedData)
          tokenData = JSON.parse(decryptedString)
        } catch (decryptError) {
          console.warn('Failed to decrypt token, attempting fallback:', decryptError)
          // Try to parse as unencrypted data
          tokenData = JSON.parse(storedData)
        }
      } else {
        tokenData = JSON.parse(storedData)
      }

      // Validate token expiration
      const now = Date.now()
      if (tokenData.expiresAt && tokenData.expiresAt < now) {
        this.clearToken()
        return null
      }

      // Check if token is close to expiring (within buffer time)
      if (tokenData.expiresAt && (tokenData.expiresAt - now) < this.TOKEN_EXPIRY_BUFFER) {
        console.warn('Token is close to expiring')
        // Could trigger refresh here
      }

      return tokenData
    } catch (error) {
      console.error('Failed to retrieve token:', error)
      this.clearToken()
      return null
    }
  }

  /**
   * Checks if current token is valid without retrieving it
   */
  async isTokenValid(): Promise<boolean> {
    const tokenData = await this.getValidToken()
    return tokenData !== null
  }

  /**
   * Gets the current user from stored token
   */
  async getCurrentUser(): Promise<User | null> {
    const tokenData = await this.getValidToken()
    return tokenData?.user || null
  }

  /**
   * Clears all stored authentication data
   */
  clearToken(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem('auth_token') // Primary token storage
    localStorage.removeItem('token') // Legacy token storage
    localStorage.removeItem('authToken') // Legacy auth token
    localStorage.removeItem('user') // Legacy user storage
  }

  /**
   * Updates user data in stored token
   */
  async updateUser(user: User): Promise<void> {
    const tokenData = await this.getValidToken()
    if (tokenData) {
      tokenData.user = user
      await this.storeToken(tokenData.token, user, tokenData.expiresAt - Date.now())
    }
  }

  private async encryptData(data: string): Promise<EncryptedTokenData> {
    if (!this.encryptionKey) throw new Error('Encryption key not available')

    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encoder = new TextEncoder()
    const encodedData = encoder.encode(data)

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      encodedData
    )

    return {
      data: this.arrayBufferToBase64(encrypted),
      iv: this.arrayBufferToBase64(iv.buffer),
      timestamp: Date.now()
    }
  }

  private async decryptData(encryptedData: EncryptedTokenData): Promise<string> {
    if (!this.encryptionKey) throw new Error('Encryption key not available')

    const iv = this.base64ToArrayBuffer(encryptedData.iv)
    const data = this.base64ToArrayBuffer(encryptedData.data)

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      data
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }
}

// Export singleton instance
export const tokenSecurityManager = new TokenSecurityManager()

/**
 * Legacy storage functions for backward compatibility
 * These should be migrated to use the secure token manager
 */
export const legacyTokenUtils = {
  getToken(): string | null {
    return localStorage.getItem('auth_token') || localStorage.getItem('token') || localStorage.getItem('authToken')
  },

  setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  },

  removeToken(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
  },

  getUser(): User | null {
    const userJson = localStorage.getItem('user')
    if (!userJson) return null

    try {
      return JSON.parse(userJson)
    } catch {
      return null
    }
  },

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  },

  removeUser(): void {
    localStorage.removeItem('user')
  }
}

/**
 * Validates token format and basic structure
 */
export function validateTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false

  // Basic JWT format validation (3 parts separated by dots)
  const parts = token.split('.')
  if (parts.length !== 3) return false

  try {
    // Validate that each part is valid base64
    for (const part of parts) {
      atob(part.replace(/-/g, '+').replace(/_/g, '/'))
    }
    return true
  } catch {
    return false
  }
}

/**
 * Extracts expiration time from JWT token
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.exp ? payload.exp * 1000 : null // Convert to milliseconds
  } catch {
    return null
  }
}

/**
 * Checks if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token)
  if (!expiration) return true

  return Date.now() >= expiration
}