/**
 * QuickActionsCard Component
 * Displays quick action buttons for common document operations
 */

'use client';

import React from 'react';
import {
  Plus,
  Upload,
  FileText,
  Download,
  Archive,
  Shield,
  Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickActionsCardProps {
  onUploadDocument?: () => void;
  onCreateTemplate?: () => void;
  onBulkExport?: () => void;
  onArchiveDocuments?: () => void;
  onReviewPermissions?: () => void;
  onScheduleCleanup?: () => void;
  className?: string;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onUploadDocument,
  onCreateTemplate,
  onBulkExport,
  onArchiveDocuments,
  onReviewPermissions,
  onScheduleCleanup,
  className = ''
}) => {
  return (
    <Card className={className}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-purple-600" />
          Quick Actions
        </h3>

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={onUploadDocument}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={onCreateTemplate}
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Template
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={onBulkExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Bulk Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={onArchiveDocuments}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive Old Documents
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={onReviewPermissions}
          >
            <Shield className="h-4 w-4 mr-2" />
            Review Permissions
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={onScheduleCleanup}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Cleanup
          </Button>
        </div>
      </div>
    </Card>
  );
};
