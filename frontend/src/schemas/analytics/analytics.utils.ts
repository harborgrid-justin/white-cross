/**
 * Analytics Validation Utilities
 *
 * Helper functions for validating analytics data, filters, aggregations,
 * and field configurations.
 *
 * @module analytics.utils
 */

import type { FilterOperator, AggregationFunction } from './analytics.base.schemas';

/**
 * Validate date range does not exceed maximum
 *
 * @param startDate - Start date string (ISO format or YYYY-MM-DD)
 * @param endDate - End date string (ISO format or YYYY-MM-DD)
 * @param maxDays - Maximum allowed days in range (default: 365)
 * @returns true if date range is valid, false otherwise
 */
export function validateDateRange(
  startDate: string,
  endDate: string,
  maxDays: number = 365
): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= maxDays;
}

/**
 * Validate filter value based on operator
 *
 * Ensures that the appropriate value or values are provided based on
 * the filter operator type.
 *
 * @param operator - Filter operator type
 * @param value - Single value for the filter
 * @param values - Array of values for multi-value operators
 * @returns true if the value configuration is valid for the operator
 */
export function validateFilterValue(
  operator: FilterOperator,
  value: any,
  values?: any[]
): boolean {
  switch (operator) {
    case 'between':
    case 'in':
    case 'notIn':
      return Array.isArray(values) && values.length > 0;
    case 'isNull':
    case 'isNotNull':
      return true;
    default:
      return value !== undefined && value !== null;
  }
}

/**
 * Sanitize field names to prevent SQL injection
 *
 * Removes all characters except alphanumeric and underscores to ensure
 * field names are safe for database queries.
 *
 * @param field - Field name to sanitize
 * @returns Sanitized field name
 */
export function sanitizeFieldName(field: string): string {
  return field.replace(/[^a-zA-Z0-9_]/g, '');
}

/**
 * Validate aggregation field compatibility
 *
 * Checks if an aggregation function is compatible with a given field.
 * Note: This is a basic validation. Production systems should validate
 * against actual schema metadata.
 *
 * @param func - Aggregation function to validate
 * @param field - Field name to validate against
 * @returns true if the aggregation is valid for the field type
 */
export function validateAggregationField(
  func: AggregationFunction,
  field: string
): boolean {
  // Count can work on any field
  if (func === 'count') return true;

  // Numeric functions require numeric fields
  const numericFunctions: AggregationFunction[] = [
    'sum',
    'avg',
    'min',
    'max',
    'median',
    'stddev',
    'variance',
  ];

  if (numericFunctions.includes(func)) {
    // In a real implementation, check field type from schema
    return true; // Placeholder - should validate against data source schema
  }

  return true;
}
