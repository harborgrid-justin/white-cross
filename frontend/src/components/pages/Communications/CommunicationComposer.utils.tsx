import React from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { CommunicationType, CommunicationPriority } from './CommunicationCard';

/**
 * Get the appropriate icon for communication type
 */
export const getTypeIcon = (commType: CommunicationType): React.ReactElement => {
  switch (commType) {
    case 'email':
      return <EnvelopeIcon className="h-5 w-5" />;
    case 'phone':
      return <PhoneIcon className="h-5 w-5" />;
    case 'sms':
      return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
    case 'chat':
      return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
    default:
      return <EnvelopeIcon className="h-5 w-5" />;
  }
};

/**
 * Get priority color classes
 */
export const getPriorityColor = (priorityLevel: CommunicationPriority): string => {
  switch (priorityLevel) {
    case 'urgent':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'normal':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'low':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200';
  }
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
