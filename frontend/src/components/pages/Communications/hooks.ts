import { useState, useEffect, useCallback } from 'react';
import type { CommunicationTemplate, TemplateFilters } from './types';
import { mockTemplates } from './helpers';

/**
 * Custom hook for managing communication templates
 */
export const useTemplates = () => {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());

  // Load templates
  useEffect(() => {
    const loadTemplates = () => {
      setTemplates(mockTemplates);
    };
    loadTemplates();
  }, []);

  // Handle template selection
  const handleTemplateSelect = (templateId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedTemplates);
    if (isSelected) {
      newSelected.add(templateId);
    } else {
      newSelected.delete(templateId);
    }
    setSelectedTemplates(newSelected);
  };

  // Handle select all
  const handleSelectAll = (filteredTemplates: CommunicationTemplate[]) => {
    if (selectedTemplates.size === filteredTemplates.length) {
      setSelectedTemplates(new Set());
    } else {
      setSelectedTemplates(new Set(filteredTemplates.map(t => t.id)));
    }
  };

  // Handle template duplicate
  const handleDuplicateTemplate = (template: CommunicationTemplate) => {
    const duplicatedTemplate = {
      ...template,
      id: `${template.id}_copy_${Date.now()}`,
      name: `${template.name} (Copy)`,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTemplates(prev => [...prev, duplicatedTemplate]);
  };

  return {
    templates,
    selectedTemplates,
    setSelectedTemplates,
    handleTemplateSelect,
    handleSelectAll,
    handleDuplicateTemplate
  };
};

/**
 * Custom hook for filtering and sorting templates
 */
export const useTemplateFilters = (
  templates: CommunicationTemplate[],
  filters: TemplateFilters
) => {
  const filteredTemplates = useCallback(() => {
    let result = [...templates];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        template.content.toLowerCase().includes(searchLower) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply type filter
    if (filters.type) {
      result = result.filter(template => template.type === filters.type);
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(template => template.category === filters.category);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(template =>
        filters.status === 'active' ? template.isActive : !template.isActive
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      result = result.filter(template =>
        filters.tags.every(tag => template.tags.includes(tag))
      );
    }

    // Sort results
    result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'usage_count':
          aValue = a.usage_count;
          bValue = b.usage_count;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'updated_at':
          aValue = new Date(a.updated_at).getTime();
          bValue = new Date(b.updated_at).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return filters.sortOrder === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return result;
  }, [templates, filters]);

  return filteredTemplates();
};
