/**
 * Utility functions for profile management
 * Includes formatting, validation, and helper functions
 */

import type { SecurityLog, FileValidation } from '../types/profile.types';

/**
 * Format file size from bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format timestamp to relative time
 */
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days === 1) {
    return 'Yesterday';
  } else {
    return `${days}d ago`;
  }
};

/**
 * Format full timestamp for display
 */
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date);
};

/**
 * Get risk level color for security logs
 */
export const getRiskLevelColor = (riskLevel: SecurityLog['riskLevel']): string => {
  switch (riskLevel) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

/**
 * Get device icon based on user agent or device name
 */
export const getDeviceIcon = (userAgent: string, deviceName: string): string => {
  const ua = userAgent.toLowerCase();
  const device = deviceName.toLowerCase();
  
  if (ua.includes('mobile') || device.includes('phone')) {
    return '📱';
  } else if (ua.includes('tablet') || device.includes('ipad')) {
    return '📱';
  } else if (ua.includes('mac') || device.includes('mac')) {
    return '💻';
  } else if (ua.includes('windows') || device.includes('windows')) {
    return '🖥️';
  } else if (ua.includes('linux') || device.includes('linux')) {
    return '🐧';
  } else {
    return '💻';
  }
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one special character');
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (US)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9]?[\s\-\.]?\(?[0-9]{3}\)?[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}$/;
  return phoneRegex.test(phone);
};

/**
 * File validation configuration
 */
export const AVATAR_VALIDATION: FileValidation = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  maxDimensions: {
    width: 2048,
    height: 2048
  }
};

/**
 * Validate file upload
 */
export const validateFile = (file: File, validation: FileValidation): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Size validation
  if (file.size > validation.maxSize) {
    errors.push(`File size must be less than ${formatFileSize(validation.maxSize)}`);
  }

  // Type validation
  if (!validation.allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${validation.allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate avatar initials from name
 */
export const getAvatarInitials = (firstName: string, lastName: string): string => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
};

/**
 * Generate random avatar background color
 */
export const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500'
  ];
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length] || 'bg-blue-500';
};

/**
 * Mask sensitive information
 */
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (!username || !domain || username.length <= 2) return email;
  
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

/**
 * Mask phone number
 */
export const maskPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ***-${cleaned.slice(-4)}`;
  }
  return phone;
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Get timezone options for select
 */
export const getTimezoneOptions = (): Array<{ value: string; label: string }> => {
  return [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' }
  ];
};

/**
 * Check if session is recently active (within last 30 minutes)
 */
export const isRecentlyActive = (lastActivity: Date): boolean => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  return lastActivity > thirtyMinutesAgo;
};