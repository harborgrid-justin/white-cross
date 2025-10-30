'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  BarChart3,
  Filter
} from 'lucide-react';

/**
 * Interface for compliance data
 */
interface ComplianceData {
  studentId: string;
  studentName: string;
  medicationId: string;
  medicationName: string;
  totalDoses: number;
  completedDoses: number;
  missedDoses: number;
  refusedDoses: number;
  complianceRate: number;
  trend: 'improving' | 'declining' | 'stable';
  lastAdministered?: string;
  nextDue?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Props for the MedicationComplianceTracker component
 */
interface MedicationComplianceTrackerProps {
  /** Array of compliance data */
  complianceData?: ComplianceData[];
  /** Loading state */
  loading?: boolean;
  /** Date range for compliance tracking */
  dateRange?: { start: Date; end: Date };
  /** Callback when date range changes */
  onDateRangeChange?: (range: { start: Date; end: Date }) => void;
  /** Filter by compliance threshold */
  complianceFilter?: 'all' | 'excellent' | 'good' | 'poor' | 'critical';
  /** Callback when filter changes */
  onFilterChange?: (filter: 'all' | 'excellent' | 'good' | 'poor' | 'critical') => void;
  /** Callback when compliance item is clicked */
  onComplianceClick?: (data: ComplianceData) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * MedicationComplianceTracker Component
 * 
 * Tracks and displays medication compliance rates with trends,
 * filtering, and detailed compliance analytics.
 * 
 * @component
 * @example
 * ```tsx
 * <MedicationComplianceTracker 
 *   complianceData={complianceData}
 *   onComplianceClick={handleComplianceClick}
 *   complianceFilter="poor"
 * />
 * ```
 */
export const MedicationComplianceTracker = ({
  complianceData = [],
  loading = false,
  dateRange,
  onDateRangeChange,
  complianceFilter = 'all',
  onFilterChange,
  onComplianceClick,
  className = ''
}: MedicationComplianceTrackerProps) => {
  const [sortBy, setSortBy] = useState<'name' | 'compliance' | 'trend'>('compliance');

  const getComplianceLevel = (rate: number) => {
    if (rate >= 95) return 'excellent';
    if (rate >= 85) return 'good';
    if (rate >= 70) return 'poor';
    return 'critical';
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 bg-green-100';
    if (rate >= 85) return 'text-blue-600 bg-blue-100';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (trend: ComplianceData['trend']) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter compliance data
  const filteredData = complianceData.filter(item => {
    if (complianceFilter === 'all') return true;
    return getComplianceLevel(item.complianceRate) === complianceFilter;
  });

  // Sort compliance data
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.studentName.localeCompare(b.studentName);
      case 'compliance':
        return b.complianceRate - a.complianceRate;
      case 'trend':
        const trendOrder = { improving: 3, stable: 2, declining: 1 };
        return trendOrder[b.trend] - trendOrder[a.trend];
      default:
        return 0;
    }
  });

  // Calculate summary statistics
  const totalStudents = complianceData.length;
  const averageCompliance = complianceData.length > 0 
    ? Math.round(complianceData.reduce((sum, item) => sum + item.complianceRate, 0) / complianceData.length)
    : 0;
  const excellentCount = complianceData.filter(item => getComplianceLevel(item.complianceRate) === 'excellent').length;
  const criticalCount = complianceData.filter(item => getComplianceLevel(item.complianceRate) === 'critical').length;

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medication Compliance</h1>
            <p className="text-sm text-gray-600 mt-1">Track medication adherence and compliance rates</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <User className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Avg Compliance</p>
                <p className="text-2xl font-bold text-blue-900">{averageCompliance}%</p>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Excellent</p>
                <p className="text-2xl font-bold text-green-900">{excellentCount}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical</p>
                <p className="text-2xl font-bold text-red-900">{criticalCount}</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={complianceFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFilterChange && onFilterChange(e.target.value as typeof complianceFilter)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by compliance level"
              >
                <option value="all">All Levels</option>
                <option value="excellent">Excellent (≥95%)</option>
                <option value="good">Good (85-94%)</option>
                <option value="poor">Poor (70-84%)</option>
                <option value="critical">Critical (&lt;70%)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sort by criteria"
            >
              <option value="compliance">Compliance Rate</option>
              <option value="name">Student Name</option>
              <option value="trend">Trend</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compliance List */}
      <div className="px-6 py-4">
        {sortedData.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No compliance data found</h3>
            <p className="text-gray-600">
              {complianceFilter === 'all' 
                ? 'No compliance data is available for the selected period.'
                : `No students with ${complianceFilter} compliance levels found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedData.map((item) => (
              <div
                key={`${item.studentId}-${item.medicationId}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => onComplianceClick && onComplianceClick(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.studentName}</h3>
                        <p className="text-sm text-gray-600">{item.medicationName}</p>
                      </div>
                      {getTrendIcon(item.trend)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Compliance Rate</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-lg font-bold ${getComplianceColor(item.complianceRate)}`}>
                            {item.complianceRate}%
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">{item.completedDoses}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Missed</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">{item.missedDoses}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total Doses</p>
                        <span className="text-sm font-medium mt-1 block">{item.totalDoses}</span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.complianceRate >= 95 ? 'bg-green-500' :
                          item.complianceRate >= 85 ? 'bg-blue-500' :
                          item.complianceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.complianceRate}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        {item.lastAdministered && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Last: {formatDate(item.lastAdministered)}</span>
                          </div>
                        )}
                        {item.nextDue && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Next: {formatTime(item.nextDue)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${item.trend === 'improving' ? 'bg-green-100 text-green-800' :
                            item.trend === 'declining' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {item.trend}
                        </span>
                        
                        {item.priority !== 'low' && (
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${item.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              item.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          `}>
                            {item.priority} priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationComplianceTracker;
