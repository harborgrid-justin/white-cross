/**
 * @fileoverview Communications Utilities - Shared helper functions
 * @module app/(dashboard)/communications/_components/communications.utils
 * @category Communications - Utilities
 */

import {
  MessageCircle,
  Users,
  Bell,
  type LucideIcon
} from 'lucide-react';

/**
 * Get badge variant for message status
 */
export function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status.toLowerCase()) {
    case 'sent':
      return 'default';
    case 'delivered':
      return 'secondary';
    case 'read':
      return 'default';
    case 'failed':
      return 'destructive';
    case 'draft':
      return 'secondary';
    case 'scheduled':
      return 'outline';
    case 'archived':
      return 'outline';
    case 'deleted':
      return 'destructive';
    default:
      return 'secondary';
  }
}

/**
 * Get badge variant for message priority
 */
export function getPriorityBadgeVariant(priority: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'destructive';
    case 'high':
      return 'destructive';
    case 'normal':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'secondary';
  }
}

/**
 * Get icon component for message type
 */
export function getTypeIcon(type: string): LucideIcon {
  switch (type.toLowerCase()) {
    case 'direct':
      return MessageCircle;
    case 'group':
      return Users;
    case 'system':
      return Bell;
    default:
      return MessageCircle;
  }
}

/**
 * Get color class for message type
 */
export function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'direct':
      return 'text-blue-600';
    case 'group':
      return 'text-green-600';
    case 'system':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Format date for display
 */
export function formatMessageDate(date: Date): string {
  return new Date(date).toLocaleString();
}

/**
 * Calculate delivery rate percentage
 */
export function calculateDeliveryRate(delivered: number, total: number): string {
  if (total === 0) return '0.0';
  return ((delivered / total) * 100).toFixed(1);
}

/**
 * Calculate read rate percentage
 */
export function calculateReadRate(read: number, delivered: number): string {
  if (delivered === 0) return '0.0';
  return ((read / delivered) * 100).toFixed(1);
}
