'use client';

import React from 'react';
import { 
  BarChart3,
  Calendar,
  Clock,
  Download,
  Eye,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Star,
  Share2,
  Bookmark,
  MoreVertical
} from 'lucide-react';

/**
 * Report status types
 */
export type ReportStatus = 'draft' | 'published' | 'archived' | 'scheduled';

/**
 * Report category types
 */
export type ReportCategory = 'clinical' | 'financial' | 'operational' | 'compliance' | 'patient-satisfaction' | 'custom';

/**
 * Report frequency types
 */
export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on-demand';

/**
 * Base report data structure
 */
export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  frequency: ReportFrequency;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdDate: Date;
  lastUpdated: Date;
  lastGenerated?: Date;
  nextScheduled?: Date;
  tags: string[];
  metrics: {
    views: number;
    downloads: number;
    shares: number;
  };
  isBookmarked?: boolean;
  isFavorite?: boolean;
  thumbnail?: string;
  fileSize?: string;
  recordCount?: number;
  estimatedRunTime?: number;
}

/**
 * Props for the ReportCard component
 */
interface ReportCardProps {
  /** Report data to display */
  report: Report;
  /** Display variant */
  variant?: 'default' | 'compact' | 'detailed';
  /** Whether card is selectable */
  selectable?: boolean;
  /** Whether card is selected */
  selected?: boolean;
  /** Whether user can manage reports */
  canManage?: boolean;
  /** Whether user can run reports */
  canRun?: boolean;
  /** Whether user can share reports */
  canShare?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Click handler */
  onClick?: (report: Report) => void;
  /** View report handler */
  onView?: (reportId: string) => void;
  /** Run report handler */
  onRun?: (reportId: string) => void;
  /** Download report handler */
  onDownload?: (reportId: string, format: 'pdf' | 'excel' | 'csv') => void;
  /** Share report handler */
  onShare?: (reportId: string) => void;
  /** Bookmark toggle handler */
  onToggleBookmark?: (reportId: string) => void;
  /** Favorite toggle handler */
  onToggleFavorite?: (reportId: string) => void;
  /** Edit report handler */
  onEdit?: (reportId: string) => void;
  /** Delete report handler */
  onDelete?: (reportId: string) => void;
  /** Selection change handler */
  onSelectionChange?: (reportId: string, selected: boolean) => void;
}

/**
 * ReportCard Component
 * 
 * A comprehensive card component for displaying report information with support
 * for different variants, interactive actions, and detailed metadata. Provides
 * a clean interface for report browsing, management, and execution.
 * 
 * @param props - ReportCard component props
 * @returns JSX element representing the report card
 */
const ReportCard = ({
  report,
  variant = 'default',
  selectable = false,
  selected = false,
  canManage = false,
  canRun = true,
  canShare = true,
  className = '',
  onClick,
  onView,
  onRun,
  onDownload,
  onShare,
  onToggleBookmark,
  onToggleFavorite,
  onEdit,
  onDelete,
  onSelectionChange
}: ReportCardProps) => {
  /**
   * Gets category icon and color
   */
  const getCategoryInfo = (category: ReportCategory) => {
    const categoryInfo = {
      clinical: { icon: Activity, color: 'text-blue-600 bg-blue-100', label: 'Clinical' },
      financial: { icon: DollarSign, color: 'text-green-600 bg-green-100', label: 'Financial' },
      operational: { icon: BarChart3, color: 'text-purple-600 bg-purple-100', label: 'Operational' },
      compliance: { icon: CheckCircle, color: 'text-orange-600 bg-orange-100', label: 'Compliance' },
      'patient-satisfaction': { icon: Star, color: 'text-yellow-600 bg-yellow-100', label: 'Patient Satisfaction' },
      custom: { icon: FileText, color: 'text-gray-600 bg-gray-100', label: 'Custom' }
    };
    return categoryInfo[category];
  };

  /**
   * Gets status color
   */
  const getStatusColor = (status: ReportStatus): string => {
    const colors = {
      draft: 'text-gray-600 bg-gray-100',
      published: 'text-green-600 bg-green-100',
      archived: 'text-red-600 bg-red-100',
      scheduled: 'text-blue-600 bg-blue-100'
    };
    return colors[status];
  };

  /**
   * Gets frequency display text
   */
  const getFrequencyText = (frequency: ReportFrequency): string => {
    const frequencyMap = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly',
      'on-demand': 'On Demand'
    };
    return frequencyMap[frequency];
  };

  /**
   * Handles card click
   */
  const handleCardClick = () => {
    if (selectable && onSelectionChange) {
      onSelectionChange(report.id, !selected);
    } else if (onClick) {
      onClick(report);
    } else if (onView) {
      onView(report.id);
    }
  };

  const categoryInfo = getCategoryInfo(report.category);
  const CategoryIcon = categoryInfo.icon;

  if (variant === 'compact') {
    return (
      <div
        className={`
          bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer
          ${selected ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          ${className}
        `}
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {selectable && (
              <input
                type="checkbox"
                checked={selected}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                  onSelectionChange?.(report.id, e.target.checked);
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            )}
            
            <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
              <CategoryIcon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{report.title}</h3>
              <p className="text-xs text-gray-600">{categoryInfo.label} • {getFrequencyText(report.frequency)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
            
            {canRun && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onRun?.(report.id);
                }}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="Run Report"
              >
                <BarChart3 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow
        ${selected ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        ${onClick || onView || selectable ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {selectable && (
              <input
                type="checkbox"
                checked={selected}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                  onSelectionChange?.(report.id, e.target.checked);
                }}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            )}
            
            <div className={`p-3 rounded-lg ${categoryInfo.color}`}>
              <CategoryIcon className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{report.title}</h3>
                {report.isFavorite && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
                {report.isBookmarked && (
                  <Bookmark className="w-4 h-4 text-blue-500 fill-current" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{report.description}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">{categoryInfo.label}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{getFrequencyText(report.frequency)}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {report.isBookmarked !== undefined && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onToggleBookmark?.(report.id);
                }}
                className={`p-1 ${report.isBookmarked ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                title="Bookmark"
              >
                <Bookmark size={16} className={report.isBookmarked ? 'fill-current' : ''} />
              </button>
            )}
            
            {report.isFavorite !== undefined && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onToggleFavorite?.(report.id);
                }}
                className={`p-1 ${report.isFavorite ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
                title="Favorite"
              >
                <Star size={16} className={report.isFavorite ? 'fill-current' : ''} />
              </button>
            )}
            
            <button className="p-1 text-gray-400 hover:text-gray-600" title="More Options">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      {report.tags.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {report.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
              >
                {tag}
              </span>
            ))}
            {report.tags.length > 3 && (
              <span className="inline-flex px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-full">
                +{report.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Metrics */}
      {variant === 'detailed' && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Eye className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm font-semibold text-gray-900">{report.metrics.views}</span>
              </div>
              <p className="text-xs text-gray-600">Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Download className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm font-semibold text-gray-900">{report.metrics.downloads}</span>
              </div>
              <p className="text-xs text-gray-600">Downloads</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Share2 className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm font-semibold text-gray-900">{report.metrics.shares}</span>
              </div>
              <p className="text-xs text-gray-600">Shares</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>By {report.author.name}</span>
            <span>•</span>
            <span>{report.lastUpdated.toLocaleDateString()}</span>
            {report.recordCount && (
              <>
                <span>•</span>
                <span>{report.recordCount.toLocaleString()} records</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {onView && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onView(report.id);
                }}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
            )}
            
            {canRun && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onRun?.(report.id);
                }}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-white 
                         bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Run
              </button>
            )}
            
            {onDownload && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onDownload(report.id, 'pdf');
                }}
                className="p-1 text-gray-400 hover:text-green-600"
                title="Download"
              >
                <Download size={16} />
              </button>
            )}
            
            {canShare && onShare && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onShare(report.id);
                }}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="Share"
              >
                <Share2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
