/**
 * Vendor Search and Recommendation Query Hooks
 *
 * Provides TanStack Query hooks for searching vendors and getting vendor recommendations.
 *
 * @module hooks/domains/vendors/queries/useVendorSearchQueries
 */

import { useQuery } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import type { Vendor } from '../config';

/**
 * Searches for vendors based on query string and filters.
 *
 * @param {string} query - Search query string
 * @param {object} filters - Optional filters for type, category, rating, distance, and location
 * @returns TanStack Query result with search results and query states
 */
export const useVendorSearch = (query: string, filters?: {
  type?: string;
  category?: string;
  minRating?: number;
  maxDistance?: number;
  location?: string;
}) => {
  return useQuery({
    queryKey: [...vendorKeys.all, 'search', query, filters],
    queryFn: async (): Promise<{
      vendors: Vendor[];
      suggestions: string[];
      facets: {
        types: Array<{ value: string; count: number }>;
        categories: Array<{ value: string; count: number }>;
        ratings: Array<{ range: string; count: number }>;
      };
    }> => {
      const params = new URLSearchParams();
      params.append('q', query);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.minRating) params.append('minRating', filters.minRating.toString());
      if (filters?.maxDistance) params.append('maxDistance', filters.maxDistance.toString());
      if (filters?.location) params.append('location', filters.location);

      const response = await fetch(`/api/vendors/search?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to search vendors');
      return response.json();
    },
    enabled: query.length >= 2,
  });
};

/**
 * Fetches vendor recommendations based on criteria.
 *
 * @param {object} criteria - Criteria for recommendations including category, budget, location, and timeline
 * @returns TanStack Query result with recommended vendors and query states
 */
export const useVendorRecommendations = (criteria: {
  category?: string;
  budget?: number;
  location?: string;
  timeline?: string;
}) => {
  return useQuery({
    queryKey: [...vendorKeys.all, 'recommendations', criteria],
    queryFn: async (): Promise<{
      recommended: Array<{
        vendor: Vendor;
        score: number;
        reasons: string[];
        matchPercentage: number;
      }>;

      alternatives: Array<{
        vendor: Vendor;
        score: number;
        reasons: string[];
      }>;
    }> => {
      const response = await fetch('/api/vendors/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      });
      if (!response.ok) throw new Error('Failed to get recommendations');
      return response.json();
    },
    enabled: !!(criteria.category || criteria.budget),
  });
};
