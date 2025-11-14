import React from 'react';
import { Plus, Upload, Download, Share2, Archive, List, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ViewMode = 'grid' | 'list' | 'table';

interface DocumentActionsProps {
  selectedDocuments: Set<string>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onBulkDownload?: () => void;
  onBulkShare?: () => void;
  onBulkArchive?: () => void;
  onUploadDocument?: () => void;
  onBulkUpload?: () => void;
  onExportList?: () => void;
}

export const DocumentActionsComponent: React.FC<DocumentActionsProps> = ({
  selectedDocuments,
  viewMode,
  setViewMode,
  onBulkDownload,
  onBulkShare,
  onBulkArchive,
  onUploadDocument,
  onBulkUpload,
  onExportList
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Primary Actions */}
      <div className="flex items-center gap-3">
        <Button variant="default" onClick={onUploadDocument}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
        
        <Button variant="outline" onClick={onBulkUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>

        <Button variant="outline" onClick={onExportList}>
          <Download className="h-4 w-4 mr-2" />
          Export List
        </Button>

        {selectedDocuments.size > 0 && (
          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <span className="text-sm text-gray-600">
              {selectedDocuments.size} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkDownload}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkArchive}
            >
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
          </div>
        )}
      </div>

      {/* View Controls */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border border-gray-300">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Grid view"
            aria-label="Switch to grid view"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm border-l border-gray-300 ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="List view"
            aria-label="Switch to list view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
