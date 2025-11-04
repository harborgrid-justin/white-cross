/**
 * Utility functions for Report Templates
 *
 * This file contains helper functions for formatting, display, and
 * template manipulation.
 */

import React from 'react';
import {
  FileText,
  BarChart3,
  Settings,
  CheckCircle,
  Star,
  User
} from 'lucide-react';
import {
  TemplateCategory,
  TemplateComplexity,
  CategoryInfo,
  ComplexityConfig
} from './types';

/**
 * Gets category display information including label, color, and icon
 *
 * @param category - The template category
 * @returns Category information object
 */
export const getCategoryInfo = (category: TemplateCategory): CategoryInfo => {
  const categoryConfig: Record<TemplateCategory, CategoryInfo> = {
    clinical: {
      label: 'Clinical',
      color: 'bg-blue-100 text-blue-800',
      icon: FileText
    },
    financial: {
      label: 'Financial',
      color: 'bg-green-100 text-green-800',
      icon: BarChart3
    },
    operational: {
      label: 'Operational',
      color: 'bg-purple-100 text-purple-800',
      icon: Settings
    },
    compliance: {
      label: 'Compliance',
      color: 'bg-red-100 text-red-800',
      icon: CheckCircle
    },
    'patient-satisfaction': {
      label: 'Patient Satisfaction',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Star
    },
    custom: {
      label: 'Custom',
      color: 'bg-gray-100 text-gray-800',
      icon: User
    }
  };
  return categoryConfig[category];
};

/**
 * Gets complexity badge configuration
 *
 * @param complexity - The template complexity level
 * @returns Complexity configuration object
 */
export const getComplexityConfig = (
  complexity: TemplateComplexity
): ComplexityConfig => {
  const complexityConfig: Record<TemplateComplexity, ComplexityConfig> = {
    simple: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Simple'
    },
    intermediate: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Intermediate'
    },
    advanced: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Advanced'
    }
  };
  return complexityConfig[complexity];
};

/**
 * Renders a complexity badge component
 *
 * @param complexity - The template complexity level
 * @returns JSX element for the complexity badge
 */
export const renderComplexityBadge = (
  complexity: TemplateComplexity
): JSX.Element => {
  const config = getComplexityConfig(complexity);
  return React.createElement(
    'span',
    {
      className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`
    },
    config.label
  );
};

/**
 * Formats a date string to a readable format
 *
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Renders a star rating component
 *
 * @param rating - Rating value (1-5)
 * @returns JSX element for the star rating
 */
export const renderStarRating = (rating: number): JSX.Element => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      React.createElement(Star, {
        key: i,
        className: `w-3 h-3 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`
      })
    );
  }
  return React.createElement(
    'div',
    { className: 'flex items-center space-x-0.5' },
    stars
  );
};
