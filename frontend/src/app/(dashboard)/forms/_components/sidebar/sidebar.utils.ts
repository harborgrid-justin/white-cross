/**
 * Utility functions for sidebar components
 */

import type { FormTemplate, ActivityType } from './sidebar.types';

/**
 * Get CSS classes for category badge based on category type
 */
export function getCategoryBadgeColor(
  category: FormTemplate['category']
): string {
  switch (category) {
    case 'healthcare':
      return 'bg-green-100 text-green-800';
    case 'administrative':
      return 'bg-blue-100 text-blue-800';
    case 'emergency':
      return 'bg-red-100 text-red-800';
    case 'assessment':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get human-readable label for activity type
 */
export function getActivityTypeLabel(type: ActivityType): string {
  switch (type) {
    case 'form_created':
      return 'Created';
    case 'form_published':
      return 'Published';
    case 'response_received':
      return 'Response';
    case 'form_shared':
      return 'Shared';
    case 'form_archived':
      return 'Archived';
    default:
      return 'Activity';
  }
}

/**
 * Format timestamp as relative time string (e.g., "2h ago")
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return 'Just now';
  }
}
