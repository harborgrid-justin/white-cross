/**
 * Type definitions for profile management system
 * Defines interfaces for user profiles, settings, and security
 */

// Basic profile information
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  joinedAt: Date;
  bio?: string;
  location?: string;
  timezone?: string;
}

// Profile settings configuration
export interface ProfileSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    emergencyAlerts: boolean;
    medicationReminders: boolean;
    appointmentReminders: boolean;
    healthRecordUpdates: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowDirectMessages: boolean;
    shareContactInfo: boolean;
    profileVisibility: 'public' | 'staff' | 'private';
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    reducedMotion: boolean;
  };
  language: string;
  theme: 'light' | 'dark' | 'auto';
  autoLockMinutes: number;
}

// Security and audit information
export interface SecurityLog {
  id: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  successful: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ActiveSession {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  location?: string;
  lastActivity: Date;
  isCurrent: boolean;
}

// Form data interfaces
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  department?: string;
  phone?: string;
  bio?: string;
  location?: string;
  timezone?: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationFormData {
  email: boolean;
  push: boolean;
  sms: boolean;
  emergencyAlerts: boolean;
  medicationReminders: boolean;
  appointmentReminders: boolean;
  healthRecordUpdates: boolean;
}

export interface PrivacyFormData {
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  shareContactInfo: boolean;
  profileVisibility: 'public' | 'staff' | 'private';
}

export interface AccessibilityFormData {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
}

// Component props interfaces
export interface ProfileContentProps {
  initialProfile?: UserProfile;
  initialSettings?: ProfileSettings;
}

export interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (data: ProfileFormData) => Promise<void>;
  loading?: boolean;
}

export interface SecuritySectionProps {
  securityLogs: SecurityLog[];
  activeSessions: ActiveSession[];
  onChangePassword: (data: PasswordFormData) => Promise<void>;
  onToggleTwoFactor: (enable: boolean) => Promise<void>;
  onEndSession: (sessionId: string) => Promise<void>;
  twoFactorEnabled: boolean;
}

export interface NotificationSettingsProps {
  settings: ProfileSettings['notifications'];
  onUpdate: (data: NotificationFormData) => Promise<void>;
  loading?: boolean;
}

export interface PrivacySettingsProps {
  settings: ProfileSettings['privacy'];
  onUpdate: (data: PrivacyFormData) => Promise<void>;
  loading?: boolean;
}

export interface AccessibilitySettingsProps {
  settings: ProfileSettings['accessibility'];
  onUpdate: (data: AccessibilityFormData) => Promise<void>;
  loading?: boolean;
}

export interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => Promise<string>;
  loading?: boolean;
}

// Tab navigation types
export type ProfileTab = 'profile' | 'security' | 'notifications' | 'privacy' | 'accessibility';

// Action result types
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// File upload types
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileValidation {
  maxSize: number; // in bytes
  allowedTypes: string[];
  maxDimensions?: {
    width: number;
    height: number;
  };
}