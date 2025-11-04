/**
 * @fileoverview Admin Management Type Definitions
 * @module lib/actions/admin.types
 *
 * Shared TypeScript types and interfaces for admin management operations.
 * This module contains all type definitions used across admin action modules.
 */

// ==========================================
// COMMON ACTION RESULT TYPE
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

// ==========================================
// ADMIN USER TYPES
// ==========================================

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
  isActive?: boolean;
}

export interface UpdateAdminUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

// ==========================================
// DISTRICT TYPES
// ==========================================

export interface District {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDistrictData {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  isActive?: boolean;
}

// ==========================================
// SCHOOL TYPES
// ==========================================

export interface School {
  id: string;
  districtId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  principalName: string;
  principalEmail: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolData {
  districtId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  principalName: string;
  principalEmail: string;
  isActive?: boolean;
}

// ==========================================
// SYSTEM SETTINGS TYPES
// ==========================================

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string;
  isSystem: boolean;
  updatedAt: string;
}

// ==========================================
// API RESPONSE TYPE (internal helper)
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
