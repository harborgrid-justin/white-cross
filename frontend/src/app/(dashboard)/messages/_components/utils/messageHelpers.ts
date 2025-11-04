/**
 * Helper functions for message UI and operations
 */

import React from 'react';
import {
  MessageSquare,
  AlertTriangle,
  Stethoscope,
  Calendar,
  Shield,
  Users,
  Bell
} from 'lucide-react';
import { MessagePriority, MessageType } from '../types/message.types';

/**
 * Get badge color class based on message priority
 * @param priority - Message priority level
 * @returns Tailwind CSS classes for badge styling
 */
export const getPriorityBadgeColor = (priority: MessagePriority): string => {
  switch (priority) {
    case 'emergency':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'urgent':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'high':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'normal':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get icon component based on message type
 * @param type - Message type
 * @returns React element with appropriate icon
 */
export const getTypeIcon = (type: MessageType): React.ReactElement => {
  switch (type) {
    case 'emergency':
      return React.createElement(AlertTriangle, { className: "h-4 w-4 text-red-500" });
    case 'medical':
      return React.createElement(Stethoscope, { className: "h-4 w-4 text-blue-500" });
    case 'appointment':
      return React.createElement(Calendar, { className: "h-4 w-4 text-green-500" });
    case 'medication':
      return React.createElement(Shield, { className: "h-4 w-4 text-purple-500" });
    case 'incident':
      return React.createElement(AlertTriangle, { className: "h-4 w-4 text-orange-500" });
    case 'parent_communication':
      return React.createElement(Users, { className: "h-4 w-4 text-indigo-500" });
    case 'staff_notification':
      return React.createElement(Bell, { className: "h-4 w-4 text-gray-500" });
    default:
      return React.createElement(MessageSquare, { className: "h-4 w-4 text-gray-500" });
  }
};
