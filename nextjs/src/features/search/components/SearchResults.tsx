/**
 * SearchResults Component
 *
 * Display search results with pagination and highlighting
 */

'use client';

import React from 'react';
import { SearchResult, SearchEntityType } from '../types';
import { FileText, User, Pill, Calendar, AlertCircle, Package, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export function SearchResults({
  results,
  query,
  isLoading = false,
  onResultClick,
  className,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className={clsx('space-y-3', className)}>
        {[...Array(3)].map((_, i) => (
          <SearchResultSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={clsx('text-center py-12', className)}>
        <div className="text-gray-400 mb-4">
          <FileText className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className={clsx('space-y-3', className)}>
      {results.map((result) => (
        <SearchResultCard
          key={result.id}
          result={result}
          query={query}
          onClick={onResultClick}
        />
      ))}
    </div>
  );
}

/**
 * Individual search result card
 */
interface SearchResultCardProps {
  result: SearchResult;
  query: string;
  onClick?: (result: SearchResult) => void;
}

function SearchResultCard({ result, query, onClick }: SearchResultCardProps) {
  const Icon = getEntityIcon(result.entityType);

  const handleClick = () => {
    onClick?.(result);
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'p-4 bg-white border border-gray-200 rounded-lg',
        'hover:border-blue-300 hover:shadow-md transition-all duration-200',
        onClick && 'cursor-pointer'
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex items-start gap-3">
        {/* Entity Icon */}
        <div className={clsx(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          getEntityColorClass(result.entityType)
        )}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-base font-semibold text-gray-900 truncate">
              <Highlight text={result.title} query={query} />
            </h4>
            <span className={clsx(
              'flex-shrink-0 ml-2 px-2 py-1 text-xs font-medium rounded-full',
              getEntityBadgeClass(result.entityType)
            )}>
              {formatEntityType(result.entityType)}
            </span>
          </div>

          {/* Description/Snippet */}
          {result.snippet && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              <Highlight text={result.snippet} query={query} />
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {result.dateModified && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(result.dateModified)}
              </span>
            )}
            {result.score && (
              <span className="text-gray-400">
                {Math.round(result.score * 100)}% match
              </span>
            )}
          </div>

          {/* Highlights */}
          {result.highlights && result.highlights.length > 0 && (
            <div className="mt-2 space-y-1">
              {result.highlights.slice(0, 2).map((highlight, index) => (
                <div key={index} className="text-xs text-gray-500 italic line-clamp-1">
                  "...<Highlight text={highlight} query={query} />..."
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Highlight matching text
 */
interface HighlightProps {
  text: string;
  query: string;
}

function Highlight({ text, query }: HighlightProps) {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 text-gray-900 font-medium">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

/**
 * Loading skeleton
 */
function SearchResultSkeleton() {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg animate-pulse">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

// ==================== Utility Functions ====================

function getEntityIcon(entityType: SearchEntityType) {
  const icons: Record<SearchEntityType, any> = {
    [SearchEntityType.STUDENT]: User,
    [SearchEntityType.MEDICATION]: Pill,
    [SearchEntityType.HEALTH_RECORD]: FileText,
    [SearchEntityType.DOCUMENT]: FileText,
    [SearchEntityType.APPOINTMENT]: Calendar,
    [SearchEntityType.INCIDENT]: AlertCircle,
    [SearchEntityType.EMERGENCY_CONTACT]: User,
    [SearchEntityType.INVENTORY_ITEM]: Package,
    [SearchEntityType.USER]: User,
    [SearchEntityType.ALL]: FileText,
  };
  return icons[entityType] || FileText;
}

function getEntityColorClass(entityType: SearchEntityType): string {
  const colors: Record<SearchEntityType, string> = {
    [SearchEntityType.STUDENT]: 'bg-blue-100 text-blue-600',
    [SearchEntityType.MEDICATION]: 'bg-green-100 text-green-600',
    [SearchEntityType.HEALTH_RECORD]: 'bg-purple-100 text-purple-600',
    [SearchEntityType.DOCUMENT]: 'bg-gray-100 text-gray-600',
    [SearchEntityType.APPOINTMENT]: 'bg-yellow-100 text-yellow-600',
    [SearchEntityType.INCIDENT]: 'bg-red-100 text-red-600',
    [SearchEntityType.EMERGENCY_CONTACT]: 'bg-orange-100 text-orange-600',
    [SearchEntityType.INVENTORY_ITEM]: 'bg-indigo-100 text-indigo-600',
    [SearchEntityType.USER]: 'bg-teal-100 text-teal-600',
    [SearchEntityType.ALL]: 'bg-gray-100 text-gray-600',
  };
  return colors[entityType] || 'bg-gray-100 text-gray-600';
}

function getEntityBadgeClass(entityType: SearchEntityType): string {
  const colors: Record<SearchEntityType, string> = {
    [SearchEntityType.STUDENT]: 'bg-blue-100 text-blue-700',
    [SearchEntityType.MEDICATION]: 'bg-green-100 text-green-700',
    [SearchEntityType.HEALTH_RECORD]: 'bg-purple-100 text-purple-700',
    [SearchEntityType.DOCUMENT]: 'bg-gray-100 text-gray-700',
    [SearchEntityType.APPOINTMENT]: 'bg-yellow-100 text-yellow-700',
    [SearchEntityType.INCIDENT]: 'bg-red-100 text-red-700',
    [SearchEntityType.EMERGENCY_CONTACT]: 'bg-orange-100 text-orange-700',
    [SearchEntityType.INVENTORY_ITEM]: 'bg-indigo-100 text-indigo-700',
    [SearchEntityType.USER]: 'bg-teal-100 text-teal-700',
    [SearchEntityType.ALL]: 'bg-gray-100 text-gray-700',
  };
  return colors[entityType] || 'bg-gray-100 text-gray-700';
}

function formatEntityType(entityType: SearchEntityType): string {
  return entityType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
