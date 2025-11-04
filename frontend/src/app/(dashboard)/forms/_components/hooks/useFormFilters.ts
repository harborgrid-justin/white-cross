/**
 * Custom hook for managing form filtering, sorting, and computed statistics
 *
 * This hook handles search queries, status/type filters, sorting logic,
 * and calculates aggregate statistics across all forms.
 */

import { useState, useMemo } from 'react';
import {
  HealthcareForm,
  FormStatus,
  FormType,
  FormStats,
  SortField,
  SortOrder,
  ViewMode,
} from '../types/formTypes';
import { isExpiringSoon, isSubmittedToday } from '../utils/formHelpers';

/**
 * Return type for useFormFilters hook
 */
export interface UseFormFiltersReturn {
  /** Current view mode (grid or list) */
  view: ViewMode;
  /** Function to set view mode */
  setView: (view: ViewMode) => void;

  /** Current status filter */
  statusFilter: FormStatus | 'all';
  /** Function to set status filter */
  setStatusFilter: (status: FormStatus | 'all') => void;

  /** Current type filter */
  typeFilter: FormType | 'all';
  /** Function to set type filter */
  setTypeFilter: (type: FormType | 'all') => void;

  /** Current search query */
  searchQuery: string;
  /** Function to set search query */
  setSearchQuery: (query: string) => void;

  /** Whether filters panel is visible */
  showFilters: boolean;
  /** Function to toggle filters visibility */
  setShowFilters: (show: boolean) => void;

  /** Current sort field */
  sortBy: SortField;
  /** Function to set sort field */
  setSortBy: (field: SortField) => void;

  /** Current sort order */
  sortOrder: SortOrder;
  /** Function to set sort order */
  setSortOrder: (order: SortOrder) => void;

  /** Filtered and sorted forms array */
  filteredForms: HealthcareForm[];

  /** Computed form statistics */
  stats: FormStats;

  /** Function to reset all filters */
  resetFilters: () => void;
}

/**
 * Calculates aggregate statistics from forms array
 */
function calculateStats(forms: HealthcareForm[]): FormStats {
  return {
    totalForms: forms.length,
    activeForms: forms.filter((form) => form.status === 'published').length,
    draftForms: forms.filter((form) => form.status === 'draft').length,
    totalResponses: forms.reduce((sum, form) => sum + form.analytics.submissions, 0),
    todayResponses: forms.filter((form) => isSubmittedToday(form.analytics.lastSubmission)).length,
    averageCompletionRate:
      forms.length > 0
        ? forms.reduce((sum, form) => sum + form.analytics.completionRate, 0) / forms.length
        : 0,
    criticalForms: forms.filter((form) => form.priority === 'critical').length,
    expiringSoon: forms.filter((form) => isExpiringSoon(form.sharing.expiresAt)).length,
  };
}

/**
 * Applies filters to forms array
 */
function applyFilters(
  forms: HealthcareForm[],
  statusFilter: FormStatus | 'all',
  typeFilter: FormType | 'all',
  searchQuery: string
): HealthcareForm[] {
  let filtered = forms;

  // Apply status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter((form) => form.status === statusFilter);
  }

  // Apply type filter
  if (typeFilter !== 'all') {
    filtered = filtered.filter((form) => form.type === typeFilter);
  }

  // Apply search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (form) =>
        form.title.toLowerCase().includes(query) ||
        form.description.toLowerCase().includes(query) ||
        form.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        form.createdBy.name.toLowerCase().includes(query)
    );
  }

  return filtered;
}

/**
 * Applies sorting to forms array
 */
function applySorting(
  forms: HealthcareForm[],
  sortBy: SortField,
  sortOrder: SortOrder
): HealthcareForm[] {
  const sorted = [...forms];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updated':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'responses':
        comparison = a.analytics.submissions - b.analytics.submissions;
        break;
      case 'completion_rate':
        comparison = a.analytics.completionRate - b.analytics.completionRate;
        break;
      default:
        comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Custom hook for managing form filters, sorting, and statistics
 *
 * @param forms - Array of healthcare forms to filter and analyze
 * @returns Object containing filter state, filtered forms, and statistics
 */
export function useFormFilters(forms: HealthcareForm[]): UseFormFiltersReturn {
  const [view, setView] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<FormStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<FormType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>('updated');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Calculate statistics from all forms
  const stats: FormStats = useMemo(() => calculateStats(forms), [forms]);

  // Filter and sort forms
  const filteredForms = useMemo(() => {
    const filtered = applyFilters(forms, statusFilter, typeFilter, searchQuery);
    return applySorting(filtered, sortBy, sortOrder);
  }, [forms, statusFilter, typeFilter, searchQuery, sortBy, sortOrder]);

  // Reset all filters to default
  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
    setSortBy('updated');
    setSortOrder('desc');
  };

  return {
    view,
    setView,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredForms,
    stats,
    resetFilters,
  };
}
