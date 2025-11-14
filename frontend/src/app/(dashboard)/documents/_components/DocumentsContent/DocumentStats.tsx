import React from 'react';
import { FileText, Clock, AlertTriangle, Archive } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface DocumentStats {
  totalDocuments: number;
  activeDocuments: number;
  pendingReview: number;
  expiringSoon: number;
  confidentialDocs: number;
  storageUsed: number; // in MB
  documentsThisMonth: number;
  averageFileSize: number;
}

interface DocumentStatsProps {
  stats: DocumentStats;
}

export const DocumentStatsComponent: React.FC<DocumentStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalDocuments}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.documentsThisMonth} added this month
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.pendingReview}</p>
              <p className="text-xs text-gray-500 mt-1">Require attention</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.expiringSoon}</p>
              <p className="text-xs text-gray-500 mt-1">Within 7 days</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.storageUsed}MB</p>
              <p className="text-xs text-gray-500 mt-1">
                Avg: {stats.averageFileSize}MB per file
              </p>
            </div>
            <Archive className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </Card>
    </div>
  );
};
