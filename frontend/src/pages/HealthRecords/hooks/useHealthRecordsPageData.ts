/**
 * useHealthRecordsPageData Hook
 *
 * Manages data fetching and state for health records page
 *
 * @module hooks/useHealthRecordsPageData
 */

import { useState, useCallback } from 'react';
import { useHealthRecordsData } from '../../../hooks/useHealthRecordsData';
import { useHealthSummary, useExportHealthHistory } from '../../../hooks/useHealthRecords';
import type { TabType } from '../types';

interface UseHealthRecordsPageDataParams {
  selectedStudentId: string;
  searchQuery: string;
}

/**
 * Custom hook for managing health records page data
 */
export function useHealthRecordsPageData({
  selectedStudentId,
  searchQuery,
}: UseHealthRecordsPageDataParams) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Fetch health records data
  const {
    healthRecords,
    allergies,
    chronicConditions,
    vaccinations,
    growthMeasurements,
    screenings,
    loading,
    loadTabData,
  } = useHealthRecordsData();

  // Fetch health summary statistics
  const { data: healthSummary, isLoading: summaryLoading } = useHealthSummary(
    selectedStudentId || '1',
    { enabled: !!selectedStudentId }
  );

  // Export mutation
  const exportMutation = useExportHealthHistory();

  /**
   * Handle tab change and load appropriate data
   */
  const handleTabChange = useCallback(
    async (tabId: TabType) => {
      setActiveTab(tabId);
      if (tabId !== 'overview') {
        try {
          await loadTabData(tabId, selectedStudentId || '1', searchQuery);
        } catch (error: any) {
          if (error?.response?.status === 401 || !localStorage.getItem('authToken')) {
            throw new Error('Session expired');
          }
        }
      }
    },
    [selectedStudentId, searchQuery, loadTabData]
  );

  /**
   * Handle data export
   */
  const handleExport = useCallback(
    async (format: 'pdf' | 'json') => {
      if (!selectedStudentId) {
        throw new Error('Please select a student first');
      }

      await exportMutation.mutateAsync({
        studentId: selectedStudentId,
        format,
      });
    },
    [selectedStudentId, exportMutation]
  );

  return {
    // State
    activeTab,

    // Data
    healthRecords,
    allergies,
    chronicConditions,
    vaccinations,
    growthMeasurements,
    screenings,
    healthSummary,

    // Loading states
    loading,
    summaryLoading,
    isExporting: exportMutation.isPending,

    // Actions
    setActiveTab: handleTabChange,
    handleExport,
    loadTabData,
  };
}
