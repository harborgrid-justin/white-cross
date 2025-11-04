/**
 * Analytics Utility Functions
 *
 * Shared utilities for analytics operations
 */

'use server';

/**
 * Build query parameters from filters with date range
 */
export function buildDateRangeParams(
  dateRange: { start: Date; end: Date },
  additionalParams?: Record<string, string | string[] | boolean | number | undefined>
): Record<string, string> {
  const params: Record<string, string> = {
    startDate: dateRange.start.toISOString(),
    endDate: dateRange.end.toISOString(),
  };

  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params[key] = value.join(',');
        } else {
          params[key] = String(value);
        }
      }
    });
  }

  return params;
}

/**
 * Handle analytics error with consistent logging
 */
export function handleAnalyticsError(
  operation: string,
  error: any
): { success: false; error: string } {
  console.error(`[Server Action] ${operation} error:`, error);
  return {
    success: false,
    error: error.message || `Failed to ${operation.toLowerCase()}`,
  };
}
