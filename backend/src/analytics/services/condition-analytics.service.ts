import { Injectable } from '@nestjs/common';

import { BaseService } from '@/common/base';
/**
 * Condition Analytics Service
 * Handles health condition normalization, categorization, and analysis
 *
 * Responsibilities:
 * - Normalize condition names for consistent grouping
 * - Categorize conditions by medical category
 * - Detect seasonal patterns for conditions
 * - Provide condition visualization utilities
 */
@Injectable()
export class ConditionAnalyticsService extends BaseService {
  /**
   * Normalize condition names for consistent grouping
   */
  normalizeCondition(diagnosis: string): string {
    const normalized = diagnosis.toLowerCase().trim();

    if (normalized.includes('allergy') || normalized.includes('allergic'))
      return 'Seasonal Allergies';
    if (normalized.includes('asthma')) return 'Asthma';
    if (normalized.includes('flu') || normalized.includes('influenza'))
      return 'Influenza';
    if (normalized.includes('cold') || normalized.includes('upper respiratory'))
      return 'Common Cold';
    if (normalized.includes('headache') || normalized.includes('migraine'))
      return 'Headache';
    if (normalized.includes('stomach') || normalized.includes('gastro'))
      return 'Stomach Issues';
    if (normalized.includes('anxiety')) return 'Anxiety';
    if (normalized.includes('adhd') || normalized.includes('attention'))
      return 'ADHD';

    return diagnosis;
  }

  /**
   * Categorize condition by medical category
   */
  categorizeCondition(condition: string): string {
    const lower = condition.toLowerCase();
    if (lower.includes('allergy')) return 'Allergy';
    if (lower.includes('asthma') || lower.includes('respiratory'))
      return 'Respiratory';
    if (
      lower.includes('mental') ||
      lower.includes('anxiety') ||
      lower.includes('adhd')
    )
      return 'Mental Health';
    if (lower.includes('injury') || lower.includes('fracture')) return 'Injury';
    if (lower.includes('infection')) return 'Infectious Disease';
    return 'General';
  }

  /**
   * Detect seasonal patterns for conditions
   */
  detectSeasonality(
    condition: string,
    currentMonth: number,
  ): { peakMonths: string[]; lowMonths: string[] } | undefined {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const lower = condition.toLowerCase();
    if (lower.includes('allergy')) {
      return {
        peakMonths: ['March', 'April', 'May', 'September'],
        lowMonths: ['December', 'January', 'February'],
      };
    }
    if (lower.includes('flu')) {
      return {
        peakMonths: ['December', 'January', 'February', 'March'],
        lowMonths: ['June', 'July', 'August'],
      };
    }

    return undefined;
  }

  /**
   * Get color for condition visualization
   */
  getConditionColor(condition: string): string {
    const colors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#06B6D4',
    ];
    const hash = condition
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  /**
   * Determine if a condition is considered chronic
   */
  isChronicCondition(condition: string): boolean {
    const lower = condition.toLowerCase();
    const chronicKeywords = [
      'asthma',
      'diabetes',
      'adhd',
      'anxiety',
      'depression',
      'epilepsy',
      'chronic',
    ];
    return chronicKeywords.some((keyword) => lower.includes(keyword));
  }

  /**
   * Get severity level for a condition
   */
  getConditionSeverity(condition: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    const lower = condition.toLowerCase();

    // High severity conditions
    const highSeverity = ['severe', 'emergency', 'critical', 'anaphylaxis'];
    if (highSeverity.some((keyword) => lower.includes(keyword))) {
      return 'HIGH';
    }

    // Medium severity conditions
    const mediumSeverity = ['moderate', 'injury', 'fracture', 'infection'];
    if (mediumSeverity.some((keyword) => lower.includes(keyword))) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  /**
   * Group conditions into broader categories for reporting
   */
  groupConditionsByCategory(conditions: string[]): Map<string, string[]> {
    const categoryMap = new Map<string, string[]>();

    for (const condition of conditions) {
      const category = this.categorizeCondition(condition);
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(condition);
    }

    return categoryMap;
  }
}
