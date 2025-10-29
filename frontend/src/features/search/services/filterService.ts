/**
 * Filter Service
 *
 * Advanced filtering logic and filter evaluation
 */

import {
  FilterGroup,
  FilterCondition,
  FilterOperator,
  SearchOperator,
  SearchIndexDocument,
} from '../types';
import {
  DateRangeFilter,
  DateRangePreset,
  NumberRangeFilter,
  FilterBuilderGroup,
  FilterBuilderRule,
} from '../types/filter.types';

export class FilterService {
  /**
   * Evaluate if a document matches filter criteria
   */
  static evaluateFilters(document: SearchIndexDocument, filters: FilterGroup): boolean {
    return this.evaluateFilterGroup(document, filters);
  }

  /**
   * Evaluate a filter group (recursive)
   */
  private static evaluateFilterGroup(document: SearchIndexDocument, group: FilterGroup): boolean {
    const results = group.conditions.map(condition => {
      if ('operator' in condition && 'conditions' in condition) {
        // This is a nested filter group
        return this.evaluateFilterGroup(document, condition as FilterGroup);
      } else {
        // This is a filter condition
        return this.evaluateFilterCondition(document, condition as FilterCondition);
      }
    });

    // Apply group operator
    if (group.operator === SearchOperator.AND) {
      return results.every(r => r);
    } else if (group.operator === SearchOperator.OR) {
      return results.some(r => r);
    } else if (group.operator === SearchOperator.NOT) {
      return !results.every(r => r);
    }

    return false;
  }

  /**
   * Evaluate a single filter condition
   */
  private static evaluateFilterCondition(
    document: SearchIndexDocument,
    condition: FilterCondition
  ): boolean {
    const fieldValue = this.getFieldValue(document, condition.field);
    const filterValue = condition.value;

    switch (condition.operator) {
      case FilterOperator.EQUALS:
        return this.equals(fieldValue, filterValue);

      case FilterOperator.NOT_EQUALS:
        return !this.equals(fieldValue, filterValue);

      case FilterOperator.CONTAINS:
        return this.contains(fieldValue, filterValue);

      case FilterOperator.NOT_CONTAINS:
        return !this.contains(fieldValue, filterValue);

      case FilterOperator.STARTS_WITH:
        return this.startsWith(fieldValue, filterValue);

      case FilterOperator.ENDS_WITH:
        return this.endsWith(fieldValue, filterValue);

      case FilterOperator.GREATER_THAN:
        return this.greaterThan(fieldValue, filterValue);

      case FilterOperator.LESS_THAN:
        return this.lessThan(fieldValue, filterValue);

      case FilterOperator.GREATER_THAN_OR_EQUAL:
        return this.greaterThanOrEqual(fieldValue, filterValue);

      case FilterOperator.LESS_THAN_OR_EQUAL:
        return this.lessThanOrEqual(fieldValue, filterValue);

      case FilterOperator.BETWEEN:
        return this.between(fieldValue, filterValue);

      case FilterOperator.IN:
        return this.in(fieldValue, filterValue);

      case FilterOperator.NOT_IN:
        return !this.in(fieldValue, filterValue);

      case FilterOperator.IS_NULL:
        return fieldValue === null || fieldValue === undefined;

      case FilterOperator.IS_NOT_NULL:
        return fieldValue !== null && fieldValue !== undefined;

      case FilterOperator.REGEX:
        return this.regex(fieldValue, filterValue);

      default:
        return false;
    }
  }

  /**
   * Get field value from document (supports nested paths)
   */
  private static getFieldValue(document: SearchIndexDocument, field: string): any {
    const parts = field.split('.');
    let value: any = document;

    for (const part of parts) {
      if (value === null || value === undefined) {
        return undefined;
      }

      // Check metadata first
      if (part === 'metadata' || value === document) {
        value = document.metadata?.[parts[parts.indexOf(part) + 1]];
        break;
      }

      value = value[part];
    }

    return value;
  }

  // ==================== Operator Implementations ====================

  private static equals(fieldValue: any, filterValue: any): boolean {
    if (fieldValue instanceof Date && filterValue instanceof Date) {
      return fieldValue.getTime() === filterValue.getTime();
    }
    return fieldValue === filterValue;
  }

  private static contains(fieldValue: any, filterValue: any): boolean {
    if (typeof fieldValue === 'string' && typeof filterValue === 'string') {
      return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
    }
    if (Array.isArray(fieldValue)) {
      return fieldValue.some(v => this.equals(v, filterValue));
    }
    return false;
  }

  private static startsWith(fieldValue: any, filterValue: any): boolean {
    if (typeof fieldValue === 'string' && typeof filterValue === 'string') {
      return fieldValue.toLowerCase().startsWith(filterValue.toLowerCase());
    }
    return false;
  }

  private static endsWith(fieldValue: any, filterValue: any): boolean {
    if (typeof fieldValue === 'string' && typeof filterValue === 'string') {
      return fieldValue.toLowerCase().endsWith(filterValue.toLowerCase());
    }
    return false;
  }

  private static greaterThan(fieldValue: any, filterValue: any): boolean {
    if (typeof fieldValue === 'number' && typeof filterValue === 'number') {
      return fieldValue > filterValue;
    }
    if (fieldValue instanceof Date && filterValue instanceof Date) {
      return fieldValue.getTime() > filterValue.getTime();
    }
    return false;
  }

  private static lessThan(fieldValue: any, filterValue: any): boolean {
    if (typeof fieldValue === 'number' && typeof filterValue === 'number') {
      return fieldValue < filterValue;
    }
    if (fieldValue instanceof Date && filterValue instanceof Date) {
      return fieldValue.getTime() < filterValue.getTime();
    }
    return false;
  }

  private static greaterThanOrEqual(fieldValue: any, filterValue: any): boolean {
    return this.equals(fieldValue, filterValue) || this.greaterThan(fieldValue, filterValue);
  }

  private static lessThanOrEqual(fieldValue: any, filterValue: any): boolean {
    return this.equals(fieldValue, filterValue) || this.lessThan(fieldValue, filterValue);
  }

  private static between(fieldValue: any, filterValue: any): boolean {
    if (!Array.isArray(filterValue) || filterValue.length !== 2) {
      return false;
    }

    const [min, max] = filterValue;
    return this.greaterThanOrEqual(fieldValue, min) && this.lessThanOrEqual(fieldValue, max);
  }

  private static in(fieldValue: any, filterValue: any): boolean {
    if (!Array.isArray(filterValue)) {
      return false;
    }
    return filterValue.some(v => this.equals(fieldValue, v));
  }

  private static regex(fieldValue: any, filterValue: any): boolean {
    if (typeof fieldValue !== 'string' || typeof filterValue !== 'string') {
      return false;
    }
    try {
      const regex = new RegExp(filterValue, 'i');
      return regex.test(fieldValue);
    } catch {
      return false;
    }
  }

  // ==================== Date Range Utilities ====================

  /**
   * Convert date range preset to actual dates
   */
  static getDateRangeFromPreset(preset: DateRangePreset): { startDate: Date; endDate: Date } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (preset) {
      case DateRangePreset.TODAY:
        return {
          startDate: today,
          endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
        };

      case DateRangePreset.YESTERDAY:
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        return {
          startDate: yesterday,
          endDate: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
        };

      case DateRangePreset.THIS_WEEK:
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return {
          startDate: startOfWeek,
          endDate: now,
        };

      case DateRangePreset.LAST_WEEK:
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        return {
          startDate: lastWeekStart,
          endDate: lastWeekEnd,
        };

      case DateRangePreset.THIS_MONTH:
        return {
          startDate: new Date(now.getFullYear(), now.getMonth(), 1),
          endDate: now,
        };

      case DateRangePreset.LAST_MONTH:
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          startDate: lastMonth,
          endDate: lastMonthEnd,
        };

      case DateRangePreset.THIS_QUARTER:
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        return {
          startDate: quarterStart,
          endDate: now,
        };

      case DateRangePreset.LAST_QUARTER:
        const lastQuarterMonth = Math.floor(now.getMonth() / 3) * 3 - 3;
        const lastQuarterStart = new Date(now.getFullYear(), lastQuarterMonth, 1);
        const lastQuarterEnd = new Date(now.getFullYear(), lastQuarterMonth + 3, 0);
        return {
          startDate: lastQuarterStart,
          endDate: lastQuarterEnd,
        };

      case DateRangePreset.THIS_YEAR:
        return {
          startDate: new Date(now.getFullYear(), 0, 1),
          endDate: now,
        };

      case DateRangePreset.LAST_YEAR:
        return {
          startDate: new Date(now.getFullYear() - 1, 0, 1),
          endDate: new Date(now.getFullYear() - 1, 11, 31),
        };

      case DateRangePreset.LAST_7_DAYS:
        return {
          startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          endDate: now,
        };

      case DateRangePreset.LAST_30_DAYS:
        return {
          startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          endDate: now,
        };

      case DateRangePreset.LAST_90_DAYS:
        return {
          startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
          endDate: now,
        };

      default:
        return { startDate: today, endDate: now };
    }
  }

  /**
   * Apply date range filter
   */
  static applyDateRangeFilter(filter: DateRangeFilter): FilterCondition {
    let startDate: Date;
    let endDate: Date;

    if (filter.preset && filter.preset !== DateRangePreset.CUSTOM) {
      ({ startDate, endDate } = this.getDateRangeFromPreset(filter.preset));
    } else {
      startDate = filter.startDate || new Date(0);
      endDate = filter.endDate || new Date();
    }

    return {
      field: 'date',
      operator: FilterOperator.BETWEEN,
      value: [startDate, endDate],
    };
  }

  /**
   * Apply number range filter
   */
  static applyNumberRangeFilter(field: string, filter: NumberRangeFilter): FilterCondition {
    if (filter.min !== undefined && filter.max !== undefined) {
      return {
        field,
        operator: FilterOperator.BETWEEN,
        value: [filter.min, filter.max],
      };
    } else if (filter.min !== undefined) {
      return {
        field,
        operator: FilterOperator.GREATER_THAN_OR_EQUAL,
        value: filter.min,
      };
    } else {
      return {
        field,
        operator: FilterOperator.LESS_THAN_OR_EQUAL,
        value: filter.max!,
      };
    }
  }

  // ==================== Filter Builder Conversion ====================

  /**
   * Convert FilterBuilderGroup to FilterGroup
   */
  static builderGroupToFilterGroup(builderGroup: FilterBuilderGroup): FilterGroup {
    const conditions = builderGroup.rules.map(rule => {
      if ('rules' in rule) {
        // Nested group
        return this.builderGroupToFilterGroup(rule as FilterBuilderGroup);
      } else {
        // Rule
        const builderRule = rule as FilterBuilderRule;
        return {
          field: builderRule.field,
          operator: builderRule.operator,
          value: builderRule.value,
        } as FilterCondition;
      }
    });

    return {
      operator: builderGroup.operator === 'AND' ? SearchOperator.AND : SearchOperator.OR,
      conditions,
    };
  }

  /**
   * Convert FilterGroup to FilterBuilderGroup
   */
  static filterGroupToBuilderGroup(filterGroup: FilterGroup, idPrefix = 'filter'): FilterBuilderGroup {
    let ruleIndex = 0;

    const rules = filterGroup.conditions.map(condition => {
      if ('operator' in condition && 'conditions' in condition) {
        // Nested group
        return this.filterGroupToBuilderGroup(
          condition as FilterGroup,
          `${idPrefix}-${ruleIndex++}`
        );
      } else {
        // Condition
        const filterCondition = condition as FilterCondition;
        return {
          id: `${idPrefix}-${ruleIndex++}`,
          field: filterCondition.field,
          operator: filterCondition.operator,
          value: filterCondition.value,
          fieldDefinition: {} as any, // Would be populated from filter definitions
        } as FilterBuilderRule;
      }
    });

    return {
      id: idPrefix,
      operator: filterGroup.operator === SearchOperator.AND ? 'AND' : 'OR',
      rules,
    };
  }

  // ==================== Filter Validation ====================

  /**
   * Validate filter structure
   */
  static validateFilters(filters: FilterGroup): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const validateGroup = (group: FilterGroup, path: string): void => {
      if (!group.operator) {
        errors.push(`${path}: Missing operator`);
      }

      if (!group.conditions || group.conditions.length === 0) {
        errors.push(`${path}: No conditions specified`);
      }

      group.conditions.forEach((condition, index) => {
        const conditionPath = `${path}.conditions[${index}]`;

        if ('operator' in condition && 'conditions' in condition) {
          // Nested group
          validateGroup(condition as FilterGroup, conditionPath);
        } else {
          // Condition
          const filterCondition = condition as FilterCondition;
          if (!filterCondition.field) {
            errors.push(`${conditionPath}: Missing field`);
          }
          if (!filterCondition.operator) {
            errors.push(`${conditionPath}: Missing operator`);
          }
        }
      });
    };

    validateGroup(filters, 'root');

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // ==================== Filter Utilities ====================

  /**
   * Get all filter fields used in a filter group
   */
  static getFilterFields(filters: FilterGroup): string[] {
    const fields: string[] = [];

    const extractFields = (group: FilterGroup): void => {
      group.conditions.forEach(condition => {
        if ('operator' in condition && 'conditions' in condition) {
          extractFields(condition as FilterGroup);
        } else {
          const filterCondition = condition as FilterCondition;
          if (!fields.includes(filterCondition.field)) {
            fields.push(filterCondition.field);
          }
        }
      });
    };

    extractFields(filters);
    return fields;
  }

  /**
   * Count total conditions in filter group
   */
  static countConditions(filters: FilterGroup): number {
    let count = 0;

    const countInGroup = (group: FilterGroup): void => {
      group.conditions.forEach(condition => {
        if ('operator' in condition && 'conditions' in condition) {
          countInGroup(condition as FilterGroup);
        } else {
          count++;
        }
      });
    };

    countInGroup(filters);
    return count;
  }
}
