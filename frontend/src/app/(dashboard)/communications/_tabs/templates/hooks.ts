/**
 * WF-COMM-TEMPLATES-HOOKS | Template Custom Hooks
 * Purpose: Reusable hooks for template operations and state management
 * Upstream: Communications system | Dependencies: React, types
 * Downstream: Template components | Called by: All template components
 * Related: Template management, variable extraction
 * Exports: useTemplates, useTemplateVariables, useTemplateFilters
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Template state management and business logic
 * LLM Context: Custom hooks for template operations
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { MessageTemplate, TemplateFormData, TemplateFilters } from './types';

/**
 * Hook for managing template state and operations
 */
export function useTemplates(initialTemplates: MessageTemplate[]) {
  const [templates, setTemplates] = useState<MessageTemplate[]>(initialTemplates);

  const addTemplate = useCallback((templateData: TemplateFormData, createdBy: string) => {
    const variables = extractVariables(templateData.content);

    const newTemplate: MessageTemplate = {
      id: `${Date.now()}`,
      name: templateData.name,
      category: templateData.category,
      subject: templateData.subject,
      content: templateData.content,
      variables,
      usage: 0,
      createdAt: new Date().toISOString(),
      createdBy,
      isPublic: templateData.isPublic,
    };

    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<MessageTemplate>) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === id
          ? {
              ...template,
              ...updates,
              variables: updates.content
                ? extractVariables(updates.content)
                : template.variables,
            }
          : template
      )
    );
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  }, []);

  const incrementUsage = useCallback((id: string) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === id
          ? {
              ...template,
              usage: template.usage + 1,
              lastUsed: new Date().toISOString(),
            }
          : template
      )
    );
  }, []);

  return {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    incrementUsage,
  };
}

/**
 * Hook for template filtering logic
 */
export function useTemplateFilters(
  templates: MessageTemplate[],
  filters: TemplateFilters
) {
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch =
        template.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        template.subject.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        template.content.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesCategory =
        filters.category === 'all' || template.category === filters.category;

      return matchesSearch && matchesCategory;
    });
  }, [templates, filters]);

  return filteredTemplates;
}

/**
 * Hook for extracting and managing template variables
 */
export function useTemplateVariables(content: string) {
  const variables = useMemo(() => extractVariables(content), [content]);

  const replaceVariables = useCallback(
    (values: Record<string, string>) => {
      let result = content;
      Object.entries(values).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(regex, value);
      });
      return result;
    },
    [content]
  );

  return {
    variables,
    replaceVariables,
    hasVariables: variables.length > 0,
  };
}

/**
 * Extracts variables from template content
 * Variables are in the format {{VARIABLE_NAME}}
 */
export function extractVariables(content: string): string[] {
  const regex = /\{\{([A-Z_]+)\}\}/g;
  const matches = content.matchAll(regex);
  const variables = new Set<string>();
  for (const match of matches) {
    variables.add(match[1]);
  }
  return Array.from(variables);
}

/**
 * Hook for template category utilities
 */
export function useTemplateCategories() {
  const getCategoryLabel = useCallback((categoryValue: string, categories: Array<{ value: string; label: string }>) => {
    return categories.find(c => c.value === categoryValue)?.label || categoryValue;
  }, []);

  return {
    getCategoryLabel,
  };
}
