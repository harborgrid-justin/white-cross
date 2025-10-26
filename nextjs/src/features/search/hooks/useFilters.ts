/**
 * useFilters Hook
 *
 * Advanced filtering with filter builder and saved filters
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FilterGroup,
  FilterCondition,
  SearchOperator,
  SearchEntityType,
} from '../types';
import {
  FilterBuilderGroup,
  FilterBuilderRule,
  SavedFilter,
  FilterFieldDefinition,
  getFilterDefinitionsForEntity,
} from '../types/filter.types';
import { FilterService } from '../services/filterService';

export interface UseFiltersOptions {
  entityType?: SearchEntityType;
  initialFilters?: FilterGroup;
}

export interface UseFiltersReturn {
  // Current filters
  filters: FilterGroup | undefined;
  setFilters: (filters: FilterGroup | undefined) => void;
  clearFilters: () => void;

  // Filter conditions
  addCondition: (condition: FilterCondition) => void;
  removeCondition: (field: string) => void;
  updateCondition: (field: string, condition: FilterCondition) => void;

  // Filter groups
  addGroup: (group: FilterGroup) => void;
  setOperator: (operator: SearchOperator) => void;

  // Filter metadata
  activeFields: string[];
  conditionCount: number;
  isValid: boolean;
  validationErrors: string[];

  // Filter definitions
  availableFields: FilterFieldDefinition[];
  getFieldDefinition: (fieldId: string) => FilterFieldDefinition | undefined;
}

/**
 * Main filters hook
 */
export function useFilters(options: UseFiltersOptions = {}): UseFiltersReturn {
  const { entityType, initialFilters } = options;

  const [filters, setFiltersState] = useState<FilterGroup | undefined>(initialFilters);

  // Get available field definitions
  const availableFields = useMemo(() => {
    return entityType ? getFilterDefinitionsForEntity(entityType) : [];
  }, [entityType]);

  const getFieldDefinition = useCallback(
    (fieldId: string) => {
      return availableFields.find(f => f.id === fieldId);
    },
    [availableFields]
  );

  // Set filters with validation
  const setFilters = useCallback((newFilters: FilterGroup | undefined) => {
    setFiltersState(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(undefined);
  }, []);

  // Add condition to current filters
  const addCondition = useCallback(
    (condition: FilterCondition) => {
      if (!filters) {
        setFiltersState({
          operator: SearchOperator.AND,
          conditions: [condition],
        });
      } else {
        setFiltersState({
          ...filters,
          conditions: [...filters.conditions, condition],
        });
      }
    },
    [filters]
  );

  // Remove condition by field
  const removeCondition = useCallback(
    (field: string) => {
      if (!filters) return;

      const newConditions = filters.conditions.filter(
        condition =>
          !('field' in condition) || (condition as FilterCondition).field !== field
      );

      if (newConditions.length === 0) {
        setFiltersState(undefined);
      } else {
        setFiltersState({
          ...filters,
          conditions: newConditions,
        });
      }
    },
    [filters]
  );

  // Update condition
  const updateCondition = useCallback(
    (field: string, newCondition: FilterCondition) => {
      if (!filters) return;

      const newConditions = filters.conditions.map(condition => {
        if ('field' in condition && (condition as FilterCondition).field === field) {
          return newCondition;
        }
        return condition;
      });

      setFiltersState({
        ...filters,
        conditions: newConditions,
      });
    },
    [filters]
  );

  // Add filter group
  const addGroup = useCallback(
    (group: FilterGroup) => {
      if (!filters) {
        setFiltersState(group);
      } else {
        setFiltersState({
          ...filters,
          conditions: [...filters.conditions, group],
        });
      }
    },
    [filters]
  );

  // Set group operator
  const setOperator = useCallback(
    (operator: SearchOperator) => {
      if (!filters) return;
      setFiltersState({
        ...filters,
        operator,
      });
    },
    [filters]
  );

  // Get active filter fields
  const activeFields = useMemo(() => {
    if (!filters) return [];
    return FilterService.getFilterFields(filters);
  }, [filters]);

  // Count conditions
  const conditionCount = useMemo(() => {
    if (!filters) return 0;
    return FilterService.countConditions(filters);
  }, [filters]);

  // Validate filters
  const validation = useMemo(() => {
    if (!filters) return { valid: true, errors: [] };
    return FilterService.validateFilters(filters);
  }, [filters]);

  return {
    filters,
    setFilters,
    clearFilters,
    addCondition,
    removeCondition,
    updateCondition,
    addGroup,
    setOperator,
    activeFields,
    conditionCount,
    isValid: validation.valid,
    validationErrors: validation.errors,
    availableFields,
    getFieldDefinition,
  };
}

/**
 * Hook for filter builder
 */
export interface UseFilterBuilderReturn {
  builderGroup: FilterBuilderGroup;
  setBuilderGroup: (group: FilterBuilderGroup) => void;
  addRule: (fieldId: string) => void;
  removeRule: (ruleId: string) => void;
  updateRule: (ruleId: string, updates: Partial<FilterBuilderRule>) => void;
  addNestedGroup: () => void;
  toFilterGroup: () => FilterGroup;
  fromFilterGroup: (filterGroup: FilterGroup) => void;
}

export function useFilterBuilder(
  entityType: SearchEntityType,
  initialGroup?: FilterBuilderGroup
): UseFilterBuilderReturn {
  const availableFields = useMemo(
    () => getFilterDefinitionsForEntity(entityType),
    [entityType]
  );

  const defaultGroup: FilterBuilderGroup = {
    id: 'root',
    operator: 'AND',
    rules: [],
  };

  const [builderGroup, setBuilderGroup] = useState<FilterBuilderGroup>(
    initialGroup || defaultGroup
  );

  const addRule = useCallback(
    (fieldId: string) => {
      const fieldDef = availableFields.find(f => f.id === fieldId);
      if (!fieldDef) return;

      const newRule: FilterBuilderRule = {
        id: `rule-${Date.now()}`,
        field: fieldId,
        operator: fieldDef.defaultOperator,
        value: null,
        fieldDefinition: fieldDef,
      };

      setBuilderGroup(prev => ({
        ...prev,
        rules: [...prev.rules, newRule],
      }));
    },
    [availableFields]
  );

  const removeRule = useCallback((ruleId: string) => {
    setBuilderGroup(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule.id !== ruleId),
    }));
  }, []);

  const updateRule = useCallback(
    (ruleId: string, updates: Partial<FilterBuilderRule>) => {
      setBuilderGroup(prev => ({
        ...prev,
        rules: prev.rules.map(rule => {
          if (rule.id === ruleId && 'field' in rule) {
            return { ...rule, ...updates } as FilterBuilderRule;
          }
          return rule;
        }),
      }));
    },
    []
  );

  const addNestedGroup = useCallback(() => {
    const newGroup: FilterBuilderGroup = {
      id: `group-${Date.now()}`,
      operator: 'AND',
      rules: [],
    };

    setBuilderGroup(prev => ({
      ...prev,
      rules: [...prev.rules, newGroup],
    }));
  }, []);

  const toFilterGroup = useCallback(() => {
    return FilterService.builderGroupToFilterGroup(builderGroup);
  }, [builderGroup]);

  const fromFilterGroup = useCallback(
    (filterGroup: FilterGroup) => {
      const converted = FilterService.filterGroupToBuilderGroup(filterGroup);
      setBuilderGroup(converted);
    },
    []
  );

  return {
    builderGroup,
    setBuilderGroup,
    addRule,
    removeRule,
    updateRule,
    addNestedGroup,
    toFilterGroup,
    fromFilterGroup,
  };
}

/**
 * Hook for saved filters
 */
export interface UseSavedFiltersReturn {
  savedFilters: SavedFilter[];
  isLoading: boolean;
  saveFilter: (filter: Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<void>;
  updateFilter: (id: string, updates: Partial<SavedFilter>) => Promise<void>;
  deleteFilter: (id: string) => Promise<void>;
  loadFilter: (id: string) => SavedFilter | undefined;
}

export function useSavedFilters(entityType: SearchEntityType): UseSavedFiltersReturn {
  const queryClient = useQueryClient();

  // Fetch saved filters
  const { data: savedFilters = [], isLoading } = useQuery({
    queryKey: ['saved-filters', entityType],
    queryFn: async () => {
      // In a real app, this would fetch from an API
      // For now, use localStorage
      try {
        const stored = localStorage.getItem(`saved-filters-${entityType}`);
        if (stored) {
          return JSON.parse(stored) as SavedFilter[];
        }
        return [];
      } catch {
        return [];
      }
    },
    staleTime: Infinity,
  });

  // Save filter mutation
  const saveFilterMutation = useMutation({
    mutationFn: async (filter: Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
      const newFilter: SavedFilter = {
        ...filter,
        id: `filter-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
      };

      const updated = [...savedFilters, newFilter];
      localStorage.setItem(`saved-filters-${entityType}`, JSON.stringify(updated));
      return newFilter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters', entityType] });
    },
  });

  // Update filter mutation
  const updateFilterMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SavedFilter> }) => {
      const updated = savedFilters.map(f =>
        f.id === id ? { ...f, ...updates, updatedAt: new Date() } : f
      );
      localStorage.setItem(`saved-filters-${entityType}`, JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters', entityType] });
    },
  });

  // Delete filter mutation
  const deleteFilterMutation = useMutation({
    mutationFn: async (id: string) => {
      const updated = savedFilters.filter(f => f.id !== id);
      localStorage.setItem(`saved-filters-${entityType}`, JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters', entityType] });
    },
  });

  const loadFilter = useCallback(
    (id: string) => {
      return savedFilters.find(f => f.id === id);
    },
    [savedFilters]
  );

  return {
    savedFilters,
    isLoading,
    saveFilter: saveFilterMutation.mutateAsync,
    updateFilter: (id: string, updates: Partial<SavedFilter>) =>
      updateFilterMutation.mutateAsync({ id, updates }),
    deleteFilter: deleteFilterMutation.mutateAsync,
    loadFilter,
  };
}
