/**
 * Utility functions for formatting message-related data
 */

/**
 * Format file size from bytes to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format timestamp to relative time or date
 * @param date - Date to format
 * @returns Formatted timestamp string (e.g., "5m ago", "2h ago", or "10/31/2024")
 */
export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / (1000 * 60 * 60);

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${Math.floor(hours)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
};
