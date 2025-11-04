import { useState, useMemo } from 'react';
import type {
  ExportConfig,
  ExportFilters,
  ExportJob,
  ExportFormat,
  ExportDestination,
  ExportSettings
} from './types';

/**
 * Hook for managing export filter state
 */
export const useExportFilters = () => {
  const [filters, setFilters] = useState<ExportFilters>({
    status: 'all',
    format: 'all',
    priority: 'all'
  });

  const setStatusFilter = (status: ExportFilters['status']) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const setFormatFilter = (format: ExportFilters['format']) => {
    setFilters(prev => ({ ...prev, format }));
  };

  const setPriorityFilter = (priority: ExportFilters['priority']) => {
    setFilters(prev => ({ ...prev, priority }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      format: 'all',
      priority: 'all'
    });
  };

  return {
    filters,
    setFilters,
    setStatusFilter,
    setFormatFilter,
    setPriorityFilter,
    resetFilters
  };
};

/**
 * Hook for managing export form state
 */
export const useExportForm = () => {
  const [formData, setFormData] = useState<Partial<ExportConfig>>({
    name: '',
    reportId: '',
    format: 'pdf',
    destination: 'download',
    settings: {
      includeCharts: true,
      includeData: true,
      includeHeaders: true,
      includeFooters: true,
      pageOrientation: 'portrait',
      pageSize: 'A4',
      quality: 'high',
      compression: false
    },
    filters: {},
    recipients: []
  });

  const updateField = <K extends keyof ExportConfig>(
    field: K,
    value: ExportConfig[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSettings = (settings: Partial<ExportSettings>) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        includeCharts: true,
        includeData: true,
        includeHeaders: true,
        includeFooters: true,
        pageOrientation: 'portrait' as const,
        pageSize: 'A4' as const,
        quality: 'high' as const,
        compression: false,
        ...prev.settings,
        ...settings
      }
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      reportId: '',
      format: 'pdf',
      destination: 'download',
      settings: {
        includeCharts: true,
        includeData: true,
        includeHeaders: true,
        includeFooters: true,
        pageOrientation: 'portrait',
        pageSize: 'A4',
        quality: 'high',
        compression: false
      },
      filters: {},
      recipients: []
    });
  };

  const setFormData_ext = (data: Partial<ExportConfig>) => {
    setFormData(data);
  };

  return {
    formData,
    setFormData: setFormData_ext,
    updateField,
    updateSettings,
    resetForm
  };
};

/**
 * Hook for managing collapsible section state
 */
export const useExpandedSections = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    settings: true,
    schedule: false,
    advanced: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const expandSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: true
    }));
  };

  const collapseSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: false
    }));
  };

  return {
    expandedSections,
    toggleSection,
    expandSection,
    collapseSection
  };
};

/**
 * Hook for filtering export jobs
 */
export const useFilteredJobs = (jobs: ExportJob[], filters: ExportFilters) => {
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (filters.status !== 'all' && job.status !== filters.status) return false;
      if (filters.format !== 'all' && job.format !== filters.format) return false;
      if (filters.priority !== 'all' && job.priority !== filters.priority) return false;
      return true;
    });
  }, [jobs, filters]);

  return filteredJobs;
};
