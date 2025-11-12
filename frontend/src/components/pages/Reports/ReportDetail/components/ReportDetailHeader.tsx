'use client';

import React from 'react';
import {
  Star,
  Bookmark,
  Share2,
  Copy,
  Edit,
  Play,
  Loader,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import type { Report } from '../../ReportCard';
import type { ExecutionResult } from '../types';
import { getCategoryInfo, getStatusInfo } from '../helpers';

interface ReportDetailHeaderProps {
  report: Report;
  executionResult?: ExecutionResult;
  canEdit: boolean;
  canRun: boolean;
  canShare: boolean;
  loading: boolean;
  onBack?: () => void;
  onToggleBookmark?: () => void;
  onToggleFavorite?: () => void;
  onShareReport?: () => void;
  onCloneReport?: () => void;
  onEditReport?: () => void;
  onRunReport: () => void;
}

/**
 * ReportDetailHeader Component
 *
 * Displays the report header with title, metadata, and action buttons.
 */
const ReportDetailHeader: React.FC<ReportDetailHeaderProps> = ({
  report,
  executionResult,
  canEdit,
  canRun,
  canShare,
  loading,
  onBack,
  onToggleBookmark,
  onToggleFavorite,
  onShareReport,
  onCloneReport,
  onEditReport,
  onRunReport
}) => {
  const categoryInfo = getCategoryInfo(report.category);
  const statusInfo = getStatusInfo(report.status);
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="border-b border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Back"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          )}

          <div className={`p-3 rounded-lg ${categoryInfo.color}`}>
            <CategoryIcon className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{report.title}</h1>
              {report.isFavorite && (
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              )}
              {report.isBookmarked && (
                <Bookmark className="w-5 h-5 text-blue-500 fill-current" />
              )}
            </div>

            <p className="text-gray-600 mt-1">{report.description}</p>

            <div className="flex items-center space-x-4 mt-3">
              <span className="text-sm text-gray-500">{categoryInfo.label}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">By {report.author.name}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">Updated {report.lastUpdated.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-lg ${report.isBookmarked ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${report.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}

          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-lg ${report.isFavorite ? 'text-yellow-600 bg-yellow-100' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
              title="Favorite"
            >
              <Star className={`w-4 h-4 ${report.isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}

          {canShare && onShareReport && (
            <button
              onClick={onShareReport}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {onCloneReport && (
            <button
              onClick={onCloneReport}
              className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
              title="Clone"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}

          {canEdit && onEditReport && (
            <button
              onClick={onEditReport}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}

          {canRun && (
            <button
              onClick={onRunReport}
              disabled={executionResult?.status === 'running' || loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {executionResult?.status === 'running' ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Running
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Report
                </>
              )}
            </button>
          )}

          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" title="More Options">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailHeader;
