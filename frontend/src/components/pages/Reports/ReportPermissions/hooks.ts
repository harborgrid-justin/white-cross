/**
 * Custom React hooks for ReportPermissions component
 * Manages state, filtering, forms, and bulk operations
 */

import { useState, useMemo, useCallback } from 'react';
import type {
  PermissionRule,
  PermissionTemplate,
  AccessLogEntry,
  PermissionFilters,
  PermissionLevel,
  PermissionScope
} from './types';
import {
  filterPermissionRules,
  filterAccessLogs,
  toggleSelection,
  getAllIds,
  validatePermissionRule,
  validateTemplate
} from './utils';

/**
 * Hook for managing permission rule filters
 * Handles search and filter state with memoized results
 */
export const usePermissionFilters = (rules: PermissionRule[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PermissionFilters>({
    entityType: 'all',
    level: 'all',
    scope: 'all'
  });

  const filteredRules = useMemo(
    () => filterPermissionRules(rules, searchTerm, filters),
    [rules, searchTerm, filters]
  );

  const updateFilter = useCallback((filterType: keyof PermissionFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({
      entityType: 'all',
      level: 'all',
      scope: 'all'
    });
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredRules
  };
};

/**
 * Hook for managing access log filters
 * Handles search with memoized results
 */
export const useAccessLogFilters = (logs: AccessLogEntry[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(
    () => filterAccessLogs(logs, searchTerm),
    [logs, searchTerm]
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredLogs
  };
};

/**
 * Hook for managing bulk selection state
 * Handles select all, select one, and bulk operations
 */
export const useBulkSelection = <T extends { id: string }>(items: T[]) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds(prev => toggleSelection(prev, id));
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = getAllIds(items);
    setSelectedIds(allIds);
  }, [items]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === items.length && items.length > 0) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
  }, [selectedIds.length, items.length, handleSelectAll, handleDeselectAll]);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  const isAllSelected = selectedIds.length === items.length && items.length > 0;

  return {
    selectedIds,
    setSelectedIds,
    handleSelect,
    handleSelectAll,
    handleDeselectAll,
    toggleSelectAll,
    isSelected,
    isAllSelected,
    selectionCount: selectedIds.length
  };
};

/**
 * Hook for managing permission rule form state
 * Handles form data, validation, and submission
 */
export const usePermissionForm = (
  onSubmit?: (rule: Partial<PermissionRule>) => void
) => {
  const [formData, setFormData] = useState<Partial<PermissionRule>>({
    entityId: '',
    scope: 'report',
    level: 'read',
    actions: ['view'],
    conditions: {}
  });

  const [isValid, setIsValid] = useState(false);

  // Update validation when form data changes
  useMemo(() => {
    setIsValid(validatePermissionRule(formData));
  }, [formData]);

  const updateField = useCallback(
    <K extends keyof PermissionRule>(field: K, value: PermissionRule[K]) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValid && onSubmit) {
        onSubmit(formData);
      }
    },
    [formData, isValid, onSubmit]
  );

  const resetForm = useCallback(() => {
    setFormData({
      entityId: '',
      scope: 'report',
      level: 'read',
      actions: ['view'],
      conditions: {}
    });
  }, []);

  return {
    formData,
    setFormData,
    updateField,
    handleSubmit,
    resetForm,
    isValid
  };
};

/**
 * Hook for managing template form state
 * Handles template creation and validation
 */
export const useTemplateForm = (
  onSubmit?: (template: Partial<PermissionTemplate>) => void
) => {
  const [formData, setFormData] = useState<Partial<PermissionTemplate>>({
    name: '',
    description: '',
    level: 'read',
    actions: ['view'],
    scope: 'report',
    isDefault: false
  });

  const [isValid, setIsValid] = useState(false);

  // Update validation when form data changes
  useMemo(() => {
    setIsValid(validateTemplate(formData));
  }, [formData]);

  const updateField = useCallback(
    <K extends keyof PermissionTemplate>(field: K, value: PermissionTemplate[K]) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValid && onSubmit) {
        onSubmit(formData);
      }
    },
    [formData, isValid, onSubmit]
  );

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      level: 'read',
      actions: ['view'],
      scope: 'report',
      isDefault: false
    });
  }, []);

  return {
    formData,
    setFormData,
    updateField,
    handleSubmit,
    resetForm,
    isValid
  };
};

/**
 * Hook for managing modal visibility state
 * Handles open/close state for multiple modals
 */
export const useModalState = () => {
  const [modals, setModals] = useState<Record<string, boolean>>({});

  const openModal = useCallback((modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: true }));
  }, []);

  const closeModal = useCallback((modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: false }));
  }, []);

  const toggleModal = useCallback((modalId: string) => {
    setModals(prev => ({ ...prev, [modalId]: !prev[modalId] }));
  }, []);

  const isOpen = useCallback(
    (modalId: string) => !!modals[modalId],
    [modals]
  );

  return {
    openModal,
    closeModal,
    toggleModal,
    isOpen
  };
};

/**
 * Hook for managing section expansion state
 * Handles collapsible sections
 */
export const useExpansionState = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const expandSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
  }, []);

  const collapseSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: false }));
  }, []);

  const isExpanded = useCallback(
    (sectionId: string) => !!expandedSections[sectionId],
    [expandedSections]
  );

  return {
    toggleSection,
    expandSection,
    collapseSection,
    isExpanded
  };
};
