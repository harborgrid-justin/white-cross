/**
 * Utility functions for Communication Templates
 *
 * This module provides pure utility functions for rendering template icons,
 * styling category badges, and other helper functions.
 */

import React from 'react';
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import type { CommunicationTemplate } from './CommunicationTemplates.types';

/**
 * Returns the appropriate icon component for a template type
 *
 * @param type - The template type
 * @returns React icon component
 *
 * @example
 * ```tsx
 * const icon = getTypeIcon('email');
 * // Returns <EnvelopeIcon className="h-4 w-4" />
 * ```
 */
export const getTypeIcon = (type: CommunicationTemplate['type']): React.ReactElement => {
  switch (type) {
    case 'email':
      return <EnvelopeIcon className="h-4 w-4" />;
    case 'sms':
      return <DevicePhoneMobileIcon className="h-4 w-4" />;
    case 'phone_script':
      return <PhoneIcon className="h-4 w-4" />;
    case 'chat':
      return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
    default:
      return <EnvelopeIcon className="h-4 w-4" />;
  }
};

/**
 * Returns Tailwind CSS classes for category badge styling
 *
 * @param category - The template category
 * @returns Tailwind CSS class string
 *
 * @example
 * ```tsx
 * const classes = getCategoryColor('emergency');
 * // Returns 'bg-red-100 text-red-800'
 * ```
 */
export const getCategoryColor = (category: CommunicationTemplate['category']): string => {
  switch (category) {
    case 'emergency':
      return 'bg-red-100 text-red-800';
    case 'routine':
      return 'bg-blue-100 text-blue-800';
    case 'appointment':
      return 'bg-green-100 text-green-800';
    case 'medication':
      return 'bg-purple-100 text-purple-800';
    case 'general':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Filters and sorts templates based on provided filter criteria
 *
 * @param templates - Array of templates to filter
 * @param filters - Filter criteria
 * @returns Filtered and sorted array of templates
 */
export const filterAndSortTemplates = (
  templates: CommunicationTemplate[],
  filters: {
    search: string;
    type: string;
    category: string;
    tags: string[];
    status: 'all' | 'active' | 'inactive';
    sortBy: 'name' | 'usage_count' | 'created_at' | 'updated_at';
    sortOrder: 'asc' | 'desc';
  }
): CommunicationTemplate[] => {
  let result = [...templates];

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(template =>
      template.name.toLowerCase().includes(searchLower) ||
      template.content.toLowerCase().includes(searchLower) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Apply type filter
  if (filters.type) {
    result = result.filter(template => template.type === filters.type);
  }

  // Apply category filter
  if (filters.category) {
    result = result.filter(template => template.category === filters.category);
  }

  // Apply status filter
  if (filters.status !== 'all') {
    result = result.filter(template =>
      filters.status === 'active' ? template.isActive : !template.isActive
    );
  }

  // Apply tag filter
  if (filters.tags.length > 0) {
    result = result.filter(template =>
      filters.tags.every(tag => template.tags.includes(tag))
    );
  }

  // Sort results
  result.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (filters.sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'usage_count':
        aValue = a.usage_count;
        bValue = b.usage_count;
        break;
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'updated_at':
        aValue = new Date(a.updated_at).getTime();
        bValue = new Date(b.updated_at).getTime();
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return filters.sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return filters.sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });

  return result;
};
