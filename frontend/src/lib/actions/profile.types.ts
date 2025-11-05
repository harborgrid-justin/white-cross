/**
 * @fileoverview Profile Type Definitions
 * @module lib/actions/profile.types
 *
 * TypeScript type definitions and interfaces for profile management.
 * This module serves as the foundation for all profile-related operations.
 *
 * NOTE: This file contains only TypeScript types and interfaces, so it does NOT
 * need the 'use server' directive. Types are compile-time only and don't affect
 * the runtime bundle.
 */

// ==========================================
// CORE ACTION TYPES
// ==========================================

/**
 * Standard action result wrapper for server actions
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

// ==========================================
// PROFILE TYPES
// ==========================================

/**
 * Complete user profile with all associated data
 */
export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  role: 'admin' | 'nurse' | 'staff' | 'viewer';
  permissions: string[];
  avatar?: string;
  profileImage?: string;
  employeeId: string;
  hireDate: string;
  lastLogin: string;
  timezone: string;
  locale: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'system';
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    sessionTimeout: number;
  };
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    status: 'active' | 'expiring' | 'expired';
    issueDate: string;
    expiryDate: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    resource: string;
    device: string;
    timestamp: string;
    ipAddress: string;
  }>;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    desktopNotifications: boolean;
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

/**
 * Data structure for updating user profile
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  title?: string;
  department?: string;
  timezone?: string;
  locale?: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  theme?: 'light' | 'dark' | 'system';
}

// ==========================================
// SETTINGS TYPES
// ==========================================

/**
 * User profile settings including notifications, privacy, and preferences
 */
export interface ProfileSettings {
  id: string;
  userId: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    desktop: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
    statusVisible: boolean;
  };
  security: {
    sessionTimeout: number;
    requireReauth: boolean;
    allowMultipleSessions: boolean;
  };
  preferences: {
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    timezone: string;
    theme: 'light' | 'dark' | 'system';
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Data structure for updating profile settings
 */
export interface UpdateProfileSettingsData {
  notifications?: Partial<ProfileSettings['notifications']>;
  privacy?: Partial<ProfileSettings['privacy']>;
  security?: Partial<ProfileSettings['security']>;
  preferences?: Partial<ProfileSettings['preferences']>;
}

// ==========================================
// SECURITY TYPES
// ==========================================

/**
 * Data structure for changing user password
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Security audit log entry
 */
export interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
  success: boolean;
  createdAt: string;
}

/**
 * Active user session information
 */
export interface ActiveSession {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  ipAddress: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
  isCurrent: boolean;
  lastActiveAt: string;
  createdAt: string;
}
