/**
 * @fileoverview Document Caching Utilities
 * @module lib/actions/documents.cache
 *
 * Caching utilities for document data with Next.js cache integration.
 * Provides cached data fetching with automatic revalidation.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverGet } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';
import type { DocumentInfo } from './documents.types';
import { DOCUMENT_CACHE_TAGS } from './documents.types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get document by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getDocument = cache(async (id: string): Promise<DocumentInfo | null> => {
  try {
    const response = await serverGet<ApiResponse<DocumentInfo>>(
      API_ENDPOINTS.DOCUMENTS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [`document-${id}`, DOCUMENT_CACHE_TAGS.DOCUMENTS, CACHE_TAGS.PHI]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get document:', error);
    return null;
  }
});

/**
 * Get all documents with caching
 * Uses shorter TTL for frequently updated data
 */
export const getDocuments = cache(async (filters?: Record<string, unknown>): Promise<DocumentInfo[]> => {
  try {
    const response = await serverGet<ApiResponse<DocumentInfo[]>>(
      API_ENDPOINTS.DOCUMENTS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.PHI_STANDARD,
          tags: [DOCUMENT_CACHE_TAGS.DOCUMENTS, 'document-list', CACHE_TAGS.PHI]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get documents:', error);
    return [];
  }
});

/**
 * Clear document cache
 * Invalidates cache tags for a specific document or all documents
 */
export async function clearDocumentCache(documentId?: string): Promise<void> {
  if (documentId) {
    revalidateTag(`document-${documentId}`, 'default');
  }
  revalidateTag(DOCUMENT_CACHE_TAGS.DOCUMENTS, 'default');
  revalidateTag('document-list', 'default');
  revalidatePath('/documents', 'page');
}
