/**
 * Search Utilities
 *
 * Helper functions for search functionality
 */

import { SearchResult, SearchEntityType } from '../types';

/**
 * Group search results by entity type
 */
export function groupResultsByEntity(results: SearchResult[]): Map<SearchEntityType, SearchResult[]> {
  const grouped = new Map<SearchEntityType, SearchResult[]>();

  results.forEach(result => {
    const existing = grouped.get(result.entityType) || [];
    grouped.set(result.entityType, [...existing, result]);
  });

  return grouped;
}

/**
 * Filter results by entity type
 */
export function filterResultsByEntity(
  results: SearchResult[],
  entityType: SearchEntityType
): SearchResult[] {
  if (entityType === SearchEntityType.ALL) {
    return results;
  }
  return results.filter(r => r.entityType === entityType);
}

/**
 * Sort results by score
 */
export function sortByScore(results: SearchResult[], descending: boolean = true): SearchResult[] {
  return [...results].sort((a, b) =>
    descending ? b.score - a.score : a.score - b.score
  );
}

/**
 * Sort results by date
 */
export function sortByDate(results: SearchResult[], descending: boolean = true): SearchResult[] {
  return [...results].sort((a, b) => {
    const dateA = a.dateModified?.getTime() || 0;
    const dateB = b.dateModified?.getTime() || 0;
    return descending ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Get URL for search result
 */
export function getResultUrl(result: SearchResult): string {
  if (result.url) return result.url;

  // Generate URL based on entity type and ID
  const urlMap: Record<SearchEntityType, (id: string) => string> = {
    [SearchEntityType.STUDENT]: (id) => `/students/${id}`,
    [SearchEntityType.MEDICATION]: (id) => `/medications/${id}`,
    [SearchEntityType.HEALTH_RECORD]: (id) => `/health-records/${id}`,
    [SearchEntityType.DOCUMENT]: (id) => `/documents/${id}`,
    [SearchEntityType.APPOINTMENT]: (id) => `/appointments/${id}`,
    [SearchEntityType.INCIDENT]: (id) => `/incidents/${id}`,
    [SearchEntityType.EMERGENCY_CONTACT]: (id) => `/emergency-contacts/${id}`,
    [SearchEntityType.INVENTORY_ITEM]: (id) => `/inventory/${id}`,
    [SearchEntityType.USER]: (id) => `/users/${id}`,
    [SearchEntityType.ALL]: (id) => `/${id}`,
  };

  const urlGenerator = urlMap[result.entityType];
  return urlGenerator ? urlGenerator(result.id) : `/${result.id}`;
}

/**
 * Sanitize search query (remove potential XSS)
 */
export function sanitizeQuery(query: string): string {
  return query
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

/**
 * Build search URL with query params
 */
export function buildSearchUrl(
  query: string,
  entityType?: SearchEntityType,
  page?: number
): string {
  const params = new URLSearchParams();

  if (query) params.set('q', sanitizeQuery(query));
  if (entityType && entityType !== SearchEntityType.ALL) {
    params.set('type', entityType);
  }
  if (page && page > 1) params.set('page', page.toString());

  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : '/search';
}

/**
 * Parse search URL params
 */
export function parseSearchUrl(url: string): {
  query: string;
  entityType: SearchEntityType;
  page: number;
} {
  const params = new URLSearchParams(url.split('?')[1] || '');

  return {
    query: params.get('q') || '',
    entityType: (params.get('type') as SearchEntityType) || SearchEntityType.ALL,
    page: parseInt(params.get('page') || '1', 10),
  };
}
