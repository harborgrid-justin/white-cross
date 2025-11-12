import { useState, useEffect } from 'react';
import { CommunicationMetrics, TimeSeriesData, SelectedMetric, SelectedTimeframe } from './types';
import { mockMetrics, mockTimeSeriesData } from './mockData';

interface UseCommunicationAnalyticsProps {
  dateRange: {
    start: string;
    end: string;
  };
  studentId?: string;
  staffId?: string;
  category?: string;
  onDateRangeChange?: (range: { start: string; end: string }) => void;
}

interface UseCommunicationAnalyticsReturn {
  metrics: CommunicationMetrics | null;
  timeSeriesData: TimeSeriesData[];
  selectedMetric: SelectedMetric;
  setSelectedMetric: (metric: SelectedMetric) => void;
  selectedTimeframe: SelectedTimeframe;
  setSelectedTimeframe: (timeframe: SelectedTimeframe) => void;
  showExportMenu: boolean;
  setShowExportMenu: (show: boolean) => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  handleTimeframeChange: (timeframe: SelectedTimeframe) => void;
}

/**
 * Custom hook for managing communication analytics state and data
 */
export const useCommunicationAnalytics = ({
  dateRange,
  studentId,
  staffId,
  category,
  onDateRangeChange
}: UseCommunicationAnalyticsProps): UseCommunicationAnalyticsReturn => {
  // State management
  const [metrics, setMetrics] = useState<CommunicationMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<SelectedMetric>('sent');
  const [selectedTimeframe, setSelectedTimeframe] = useState<SelectedTimeframe>('30d');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    channels: true,
    categories: true,
    trends: true
  });

  // Load data
  useEffect(() => {
    const loadData = () => {
      // In a real app, this would make API calls with filters
      // For now, using mock data
      setMetrics(mockMetrics);
      setTimeSeriesData(mockTimeSeriesData);
    };

    loadData();
  }, [dateRange, studentId, staffId, category]);

  // Handle timeframe changes
  const handleTimeframeChange = (timeframe: SelectedTimeframe): void => {
    setSelectedTimeframe(timeframe);

    if (timeframe !== 'custom') {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const end = new Date();
      const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const newRange = {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      };

      onDateRangeChange?.(newRange);
    }
  };

  // Toggle section expansion
  const toggleSection = (section: string): void => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return {
    metrics,
    timeSeriesData,
    selectedMetric,
    setSelectedMetric,
    selectedTimeframe,
    setSelectedTimeframe,
    showExportMenu,
    setShowExportMenu,
    expandedSections,
    toggleSection,
    handleTimeframeChange
  };
};
