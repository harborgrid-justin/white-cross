/**
 * WF-COMP-157 | types.ts - Authentication Module Type Definitions
 * Purpose: Type definitions for authentication components and pages
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces | Key Features: Authentication types
 * Last Updated: 2025-10-24 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: Authentication type definitions, part of React frontend architecture
 */

/**
 * Access Denied Page Parameters
 * Used for displaying access denied messages with context
 */
export interface AccessDeniedParams {
  studentId?: string | null
  resource?: string | null
  reason?: string | null
}

/**
 * Login Form Data Interface
 * Represents the data structure for login form submissions
 */
export interface LoginForm {
  /** User email address */
  email: string
  /** User password */
  password: string
  /** Remember me flag for persistent sessions */
  rememberMe?: boolean
}
