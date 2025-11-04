/**
 * TemplateMetadata Component
 *
 * Displays template metadata including tags, ratings, usage count,
 * favorite toggle, and built-in badge.
 */

import React from 'react';
import { Star } from 'lucide-react';
import { ReportTemplate } from './types';
import { renderStarRating, formatDate, getCategoryInfo } from './utils';

/**
 * Props for the TemplateMetadata component
 */
export interface TemplateMetadataProps {
  /** Template to display metadata for */
  template: ReportTemplate;
  /** Show favorite toggle button */
  showFavoriteToggle?: boolean;
  /** Favorite toggle handler */
  onToggleFavorite?: (isFavorite: boolean) => void;
  /** Show full details or compact view */
  compact?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * TemplateMetadata Component
 *
 * Displays metadata for a report template including category, complexity,
 * tags, rating, usage count, and dates.
 *
 * @param props - TemplateMetadata component props
 * @returns JSX element representing the template metadata
 */
export const TemplateMetadata: React.FC<TemplateMetadataProps> = ({
  template,
  showFavoriteToggle = false,
  onToggleFavorite,
  compact = false,
  className = ''
}) => {
  const categoryInfo = getCategoryInfo(template.category);

  if (compact) {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}
          >
            {categoryInfo.label}
          </span>
          {renderStarRating(template.rating)}
        </div>

        {showFavoriteToggle && (
          <button
            onClick={() => onToggleFavorite?.(!template.isFavorite)}
            className="p-1 text-gray-400 hover:text-yellow-500"
            aria-label={
              template.isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Star
              className={`w-4 h-4 ${template.isFavorite ? 'text-yellow-400 fill-current' : ''}`}
            />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Category and Rating */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}
        >
          {categoryInfo.label}
        </span>
        {renderStarRating(template.rating)}
      </div>

      {/* Usage and Date */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{template.usageCount} uses</span>
        <span>{formatDate(template.updatedAt)}</span>
      </div>

      {/* Tags */}
      {template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{template.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Built-in Badge */}
      {template.isBuiltIn && (
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Built-in
          </span>
        </div>
      )}
    </div>
  );
};

export default TemplateMetadata;
