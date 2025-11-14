/**
 * Utility functions for message search
 */

/**
 * Formats a date string to a localized date format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Returns the appropriate CSS class for a priority level
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
      return 'text-red-600';
    case 'high':
      return 'text-orange-600';
    case 'normal':
      return 'text-blue-600';
    case 'low':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
}
