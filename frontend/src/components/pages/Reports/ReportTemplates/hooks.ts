/**
 * Custom hooks for Report Templates
 *
 * This file contains custom React hooks for template state management,
 * filtering, and CRUD operations.
 */

import { useState, useMemo, useCallback } from 'react';
import { ReportTemplate, TemplateCategory, TemplateComplexity } from './types';

/**
 * Hook for managing template filters
 *
 * @param templates - Array of report templates
 * @returns Filtered templates and filter controls
 */
export const useTemplateFilters = (templates: ReportTemplate[]) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<
    TemplateCategory | 'all'
  >('all');
  const [complexityFilter, setComplexityFilter] = useState<
    TemplateComplexity | 'all'
  >('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCategory =
        categoryFilter === 'all' || template.category === categoryFilter;
      const matchesComplexity =
        complexityFilter === 'all' || template.complexity === complexityFilter;
      const matchesFavorites =
        !showFavoritesOnly || template.isFavorite;

      return (
        matchesSearch && matchesCategory && matchesComplexity && matchesFavorites
      );
    });
  }, [templates, searchTerm, categoryFilter, complexityFilter, showFavoritesOnly]);

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    complexityFilter,
    setComplexityFilter,
    showFavoritesOnly,
    setShowFavoritesOnly,
    filteredTemplates
  };
};

/**
 * Hook for managing template editor state
 *
 * @returns Template editor state and controls
 */
export const useTemplateEditor = () => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTemplate, setNewTemplate] = useState<Partial<ReportTemplate>>({
    name: '',
    description: '',
    category: 'operational',
    complexity: 'simple',
    dataSources: [],
    fields: [],
    filters: [],
    charts: [],
    tags: [],
    isPublic: false,
    isFavorite: false,
    isBuiltIn: false,
    version: '1.0'
  });

  const openCreateModal = useCallback(() => {
    setSelectedTemplate(null);
    setNewTemplate({
      name: '',
      description: '',
      category: 'operational',
      complexity: 'simple',
      dataSources: [],
      fields: [],
      filters: [],
      charts: [],
      tags: [],
      isPublic: false,
      isFavorite: false,
      isBuiltIn: false,
      version: '1.0'
    });
    setShowCreateModal(true);
  }, []);

  const openEditModal = useCallback((template: ReportTemplate) => {
    setSelectedTemplate(template);
    setNewTemplate(template);
    setShowCreateModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowCreateModal(false);
    setSelectedTemplate(null);
    setNewTemplate({
      name: '',
      description: '',
      category: 'operational',
      complexity: 'simple',
      dataSources: [],
      fields: [],
      filters: [],
      charts: [],
      tags: [],
      isPublic: false,
      isFavorite: false,
      isBuiltIn: false,
      version: '1.0'
    });
  }, []);

  return {
    selectedTemplate,
    showCreateModal,
    newTemplate,
    setNewTemplate,
    openCreateModal,
    openEditModal,
    closeModal
  };
};

/**
 * Hook for managing template actions
 *
 * @param callbacks - Object containing action callbacks
 * @returns Template action handlers
 */
export const useTemplateActions = (callbacks: {
  onUseTemplate?: (id: string) => void;
  onPreviewTemplate?: (id: string) => void;
  onDuplicateTemplate?: (id: string) => void;
  onExportTemplate?: (id: string) => void;
  onShareTemplate?: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onDeleteTemplate?: (id: string) => void;
}) => {
  const handleTemplateAction = useCallback(
    (action: string, template: ReportTemplate) => {
      switch (action) {
        case 'use':
          callbacks.onUseTemplate?.(template.id);
          break;
        case 'preview':
          callbacks.onPreviewTemplate?.(template.id);
          break;
        case 'duplicate':
          callbacks.onDuplicateTemplate?.(template.id);
          break;
        case 'export':
          callbacks.onExportTemplate?.(template.id);
          break;
        case 'share':
          callbacks.onShareTemplate?.(template.id);
          break;
        case 'favorite':
          callbacks.onToggleFavorite?.(template.id, !template.isFavorite);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this template?')) {
            callbacks.onDeleteTemplate?.(template.id);
          }
          break;
      }
    },
    [callbacks]
  );

  return { handleTemplateAction };
};
