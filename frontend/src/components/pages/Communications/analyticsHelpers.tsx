import React from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BellIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

/**
 * Get icon component for trend type
 */
export const getTrendIcon = (trend: 'up' | 'down' | 'stable' | undefined): React.ReactElement => {
  switch (trend) {
    case 'up':
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    case 'down':
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    case 'stable':
    default:
      return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
  }
};

/**
 * Get CSS color class for trend type
 */
export const getTrendColor = (trend: 'up' | 'down' | 'stable' | undefined): string => {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    case 'stable':
    default:
      return 'text-gray-600';
  }
};

/**
 * Get icon component for communication channel
 */
export const getChannelIcon = (channel: string): React.ReactElement => {
  switch (channel) {
    case 'email':
      return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
    case 'sms':
      return <DevicePhoneMobileIcon className="h-5 w-5 text-green-500" />;
    case 'push':
      return <BellIcon className="h-5 w-5 text-purple-500" />;
    case 'in_app':
      return <ComputerDesktopIcon className="h-5 w-5 text-orange-500" />;
    default:
      return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
  }
};

/**
 * Get icon component for message status
 */
export const getStatusIcon = (status: string): React.ReactElement => {
  switch (status) {
    case 'delivered':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'pending':
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    case 'failed':
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    case 'read':
      return <EyeIcon className="h-5 w-5 text-blue-500" />;
    default:
      return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
  }
};

/**
 * Get CSS color class for category
 */
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'emergency':
      return 'bg-red-500';
    case 'appointment':
      return 'bg-blue-500';
    case 'medication':
      return 'bg-green-500';
    case 'general':
      return 'bg-purple-500';
    case 'system':
    default:
      return 'bg-gray-500';
  }
};
