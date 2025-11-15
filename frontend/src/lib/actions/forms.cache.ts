/**
 * @fileoverview Form Builder Caching Functions
 * @module lib/actions/forms.cache
 *
 * Caching utilities and cached data access functions for forms.
 * Handles Next.js cache integration with proper revalidation.
 */

'use server';

import { cache } from 'react';
import { serverGet } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TTL } from '@/lib/cache/constants';
import type { FormDefinition } from './forms.types';

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Custom cache tags for forms
 */
export const FORMS_CACHE_TAGS = {
  FORMS: 'forms',
  FORM_RESPONSES: 'form-responses',
  FORM_TEMPLATES: 'form-templates',
  FORM_BUILDER: 'form-builder',
  FORM_ANALYTICS: 'form-analytics',
} as const;

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get form by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getForm = cache(async (id: string): Promise<FormDefinition | null> => {
  try {
    const response = await serverGet<{ success: boolean; data: FormDefinition }>(
      API_ENDPOINTS.FORMS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [`form-${id}`, FORMS_CACHE_TAGS.FORMS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get form:', error);
    return null;
  }
});

/**
 * Get all forms with caching
 * Uses shorter TTL for frequently updated data
 */
export const getForms = cache(async (filters?: Record<string, unknown>): Promise<FormDefinition[]> => {
  try {
    const response = await serverGet<{ success: boolean; data: FormDefinition[] }>(
      API_ENDPOINTS.FORMS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [FORMS_CACHE_TAGS.FORMS, 'forms-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get forms:', error);
    return [];
  }
});
