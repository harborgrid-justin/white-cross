/**
 * Document Category and Template Query Hooks
 *
 * TanStack Query hooks for fetching document categories and templates.
 * Categories organize documents; templates provide pre-formatted structures.
 *
 * @module hooks/domains/documents/queries/useDocumentCategoryQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  DOCUMENTS_QUERY_KEYS,
  DOCUMENTS_CACHE_CONFIG,
  Document,
  DocumentCategory,
  DocumentTemplate,
} from '../config';
import { documentQueryAPI } from './documentQueryAPI';

/**
 * Fetch all document categories.
 * Categories rarely change, so results are cached for 30 minutes.
 *
 * @example
 * const { data: categories } = useCategories();
 */
export const useCategories = (
  filters?: any,
  options?: UseQueryOptions<DocumentCategory[], Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.categoriesList(filters),
    queryFn: () => documentQueryAPI.getCategories(filters),
    staleTime: DOCUMENTS_CACHE_CONFIG.CATEGORIES_STALE_TIME,
    ...options,
  });
};

/**
 * Fetch individual category details by ID.
 * Includes metadata and document count. Cached for 30 minutes.
 *
 * @example
 * const { data: category } = useCategoryDetails('cat-123');
 */
export const useCategoryDetails = (
  id: string,
  options?: UseQueryOptions<DocumentCategory, Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.categoryDetails(id),
    queryFn: () => documentQueryAPI.getCategoryById(id),
    staleTime: DOCUMENTS_CACHE_CONFIG.CATEGORIES_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

/**
 * Fetch all documents in a category.
 * Documents ordered by most recent first. Cached for 10 minutes.
 *
 * @example
 * const { data: docs } = useCategoryDocuments('cat-health');
 */
export const useCategoryDocuments = (
  categoryId: string,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'category', categoryId, 'documents'],
    queryFn: () => documentQueryAPI.getCategoryDocuments(categoryId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
    enabled: !!categoryId,
    ...options,
  });
};

/**
 * Fetch all document templates.
 * Templates rarely change, so results are cached for 30 minutes.
 *
 * @example
 * const { data: templates } = useTemplates();
 */
export const useTemplates = (
  filters?: any,
  options?: UseQueryOptions<DocumentTemplate[], Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.templatesList(filters),
    queryFn: () => documentQueryAPI.getTemplates(filters),
    staleTime: DOCUMENTS_CACHE_CONFIG.TEMPLATES_STALE_TIME,
    ...options,
  });
};

/**
 * Fetch individual template details by ID.
 * Includes structure and field definitions. Cached for 30 minutes.
 *
 * @example
 * const { data: template } = useTemplateDetails('tpl-123');
 */
export const useTemplateDetails = (
  id: string,
  options?: UseQueryOptions<DocumentTemplate, Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.templateDetails(id),
    queryFn: () => documentQueryAPI.getTemplateById(id),
    staleTime: DOCUMENTS_CACHE_CONFIG.TEMPLATES_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

/**
 * Fetch popular document templates.
 * Returns most frequently used templates, ordered by usage.
 * Useful for dashboard quick-start widgets. Cached for 30 minutes.
 *
 * @param limit - Maximum number of templates to return (default: 10)
 *
 * @example
 * const { data: popular } = usePopularTemplates(5);
 */
export const usePopularTemplates = (
  limit = 10,
  options?: UseQueryOptions<DocumentTemplate[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'templates', 'popular', limit],
    queryFn: () => documentQueryAPI.getPopularTemplates(limit),
    staleTime: DOCUMENTS_CACHE_CONFIG.TEMPLATES_STALE_TIME,
    ...options,
  });
};
