/**
 * WF-COMP-128 | useCommunicationOptions.constants.ts - Constants and defaults
 * Purpose: Default options and cache configuration for communication options
 * Upstream: None | Dependencies: useCommunicationOptions.types.ts
 * Downstream: useCommunicationOptions hooks | Called by: Communication hooks
 * Related: useCommunicationOptions.ts, useCommunicationOptions.types.ts
 * Exports: constants | Key Features: default options, cache config
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Default fallback options for communication channels
 * LLM Context: Constants and default values for communication options hook
 */

import type { CommunicationOptions } from './useCommunicationOptions.types';

// ============================================================================
// Constants
// ============================================================================

/**
 * Cache configuration for communication options
 * These are static configurations that change infrequently
 */
export const CACHE_CONFIG = {
  STALE_TIME: 24 * 60 * 60 * 1000, // 24 hours
  CACHE_TIME: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Default fallback options if API fails
 * Ensures the application remains functional even if config endpoint is unavailable
 */
export const DEFAULT_OPTIONS: CommunicationOptions = {
  channels: [
    {
      id: 'sms',
      label: 'SMS',
      value: 'sms',
      description: 'Send text message notifications',
      enabled: true,
      icon: 'message-circle',
    },
    {
      id: 'email',
      label: 'Email',
      value: 'email',
      description: 'Send email notifications',
      enabled: true,
      icon: 'mail',
    },
    {
      id: 'voice',
      label: 'Voice Call',
      value: 'voice',
      description: 'Automated voice call',
      enabled: true,
      icon: 'phone',
    },
  ],
  notificationTypes: [
    {
      id: 'emergency',
      label: 'Emergency',
      value: 'emergency',
      description: 'Critical emergency notifications',
      defaultPriority: 'critical',
      requiresApproval: false,
    },
    {
      id: 'health',
      label: 'Health Update',
      value: 'health',
      description: 'General health updates and alerts',
      defaultPriority: 'high',
      requiresApproval: false,
    },
    {
      id: 'medication',
      label: 'Medication',
      value: 'medication',
      description: 'Medication-related notifications',
      defaultPriority: 'medium',
      requiresApproval: false,
    },
    {
      id: 'general',
      label: 'General',
      value: 'general',
      description: 'General information and updates',
      defaultPriority: 'low',
      requiresApproval: false,
    },
  ],
  priorityLevels: [
    {
      id: 'low',
      label: 'Low',
      value: 'low',
      description: 'Non-urgent information',
      color: 'gray',
    },
    {
      id: 'medium',
      label: 'Medium',
      value: 'medium',
      description: 'Standard priority',
      color: 'blue',
    },
    {
      id: 'high',
      label: 'High',
      value: 'high',
      description: 'Important, requires attention',
      color: 'orange',
    },
    {
      id: 'critical',
      label: 'Critical',
      value: 'critical',
      description: 'Urgent, immediate action required',
      color: 'red',
    },
  ],
  verificationMethods: [
    {
      id: 'sms',
      label: 'SMS',
      value: 'sms',
    },
    {
      id: 'email',
      label: 'Email',
      value: 'email',
    },
    {
      id: 'voice',
      label: 'Voice Call',
      value: 'voice',
    },
  ],
};
